import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlaService } from '../sla/sla.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { QueryIncidentDto } from './dto/query-incident.dto';
import { IncidentPriority, IncidentStatus } from '@prisma/client';

@Injectable()
export class IncidentService {
    private readonly logger = new Logger(IncidentService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly slaService: SlaService,
    ) { }

    async create(dto: CreateIncidentDto) {
        // Generate incident number
        const count = await this.prisma.incident.count();
        const number = `INC-${String(count + 1).padStart(6, '0')}`;

        // Get SLA definition based on priority
        const slaDefinition = await this.prisma.slaDefinition.findFirst({
            where: { priority: dto.priority || IncidentPriority.MEDIUM, isActive: true },
        });

        // Calculate deadlines
        const now = new Date();
        let responseDeadline: Date | undefined;
        let resolutionDeadline: Date | undefined;

        if (slaDefinition) {
            responseDeadline = new Date(now.getTime() + slaDefinition.responseTimeMinutes * 60000);
            resolutionDeadline = new Date(now.getTime() + slaDefinition.resolutionTimeMinutes * 60000);
        }

        const incident = await this.prisma.incident.create({
            data: {
                number,
                subject: dto.subject,
                description: dto.description,
                priority: dto.priority || IncidentPriority.MEDIUM,
                category: dto.category,
                reporterId: dto.reporterId,
                reporterEmail: dto.reporterEmail,
                reporterName: dto.reporterName,
                source: dto.source || 'web',
                emailMessageId: dto.emailMessageId,
                slaDefinitionId: slaDefinition?.id,
                responseDeadline,
                resolutionDeadline,
            },
            include: {
                slaDefinition: true,
                messages: true,
            },
        });

        // Create SLA records
        if (slaDefinition) {
            await this.slaService.createSlaRecords(incident.id, responseDeadline!, resolutionDeadline!);
        }

        this.logger.log(`Created incident ${number}`);
        return incident;
    }

    async findAll(query: QueryIncidentDto) {
        const { page = 1, limit = 10, status, priority, assigneeId, search } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (assigneeId) where.assigneeId = assigneeId;
        if (search) {
            where.OR = [
                { number: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [incidents, total] = await Promise.all([
            this.prisma.incident.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    slaDefinition: true,
                    _count: { select: { messages: true } },
                },
            }),
            this.prisma.incident.count({ where }),
        ]);

        return {
            data: incidents,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const incident = await this.prisma.incident.findUnique({
            where: { id },
            include: {
                slaDefinition: true,
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
                attachments: true,
                survey: true,
                slaRecords: true,
            },
        });

        if (!incident) {
            throw new NotFoundException(`Incident with ID ${id} not found`);
        }

        return incident;
    }

    async update(id: string, dto: UpdateIncidentDto) {
        await this.findOne(id); // Check if exists

        return this.prisma.incident.update({
            where: { id },
            data: dto,
            include: { slaDefinition: true },
        });
    }

    async assign(id: string, assigneeId: string, assigneeName: string) {
        const incident = await this.findOne(id);

        // Mark as responded if not already
        const respondedAt = incident.respondedAt ? undefined : new Date();

        const updated = await this.prisma.incident.update({
            where: { id },
            data: {
                assigneeId,
                assigneeName,
                status: IncidentStatus.IN_PROGRESS,
                respondedAt,
            },
        });

        // Update SLA records
        if (respondedAt) {
            await this.slaService.markResponseCompleted(id, respondedAt);
        }

        this.logger.log(`Assigned incident ${incident.number} to ${assigneeName}`);
        return updated;
    }

    async resolve(id: string) {
        const incident = await this.findOne(id);
        const now = new Date();

        const updated = await this.prisma.incident.update({
            where: { id },
            data: {
                status: IncidentStatus.RESOLVED,
                resolvedAt: now,
            },
        });

        // Update SLA records
        await this.slaService.markResolutionCompleted(id, now);

        this.logger.log(`Resolved incident ${incident.number}`);
        return updated;
    }

    async close(id: string) {
        const incident = await this.findOne(id);

        if (incident.status !== IncidentStatus.RESOLVED) {
            throw new Error('Incident must be resolved before closing');
        }

        return this.prisma.incident.update({
            where: { id },
            data: {
                status: IncidentStatus.CLOSED,
                closedAt: new Date(),
            },
        });
    }

    async delete(id: string) {
        await this.findOne(id); // Check if exists
        return this.prisma.incident.delete({ where: { id } });
    }

    async getStats() {
        const [total, open, inProgress, breached, resolvedToday] = await Promise.all([
            this.prisma.incident.count(),
            this.prisma.incident.count({ where: { status: IncidentStatus.OPEN } }),
            this.prisma.incident.count({ where: { status: IncidentStatus.IN_PROGRESS } }),
            this.prisma.incident.count({ where: { slaBreached: true } }),
            this.prisma.incident.count({
                where: {
                    status: IncidentStatus.RESOLVED,
                    resolvedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                },
            }),
        ]);

        return {
            total,
            open,
            inProgress,
            breached,
            resolvedToday,
        };
    }

    async submitSurvey(id: string, data: { rating: number; comment?: string; submittedBy: string }) {
        await this.findOne(id); // Check if exists

        return this.prisma.satisfactionSurvey.create({
            data: {
                incidentId: id,
                rating: data.rating,
                comment: data.comment,
                submittedBy: data.submittedBy,
            },
        });
    }
}
