import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { IncidentPriority } from '@prisma/client';

@Injectable()
export class SlaService {
    private readonly logger = new Logger(SlaService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createSlaRecords(incidentId: string, responseDeadline: Date, resolutionDeadline: Date) {
        await this.prisma.slaRecord.createMany({
            data: [
                {
                    incidentId,
                    type: 'response',
                    deadline: responseDeadline,
                },
                {
                    incidentId,
                    type: 'resolution',
                    deadline: resolutionDeadline,
                },
            ],
        });
    }

    async markResponseCompleted(incidentId: string, completedAt: Date) {
        const record = await this.prisma.slaRecord.findFirst({
            where: { incidentId, type: 'response' },
        });

        if (record) {
            const breached = completedAt > record.deadline;
            await this.prisma.slaRecord.update({
                where: { id: record.id },
                data: { completedAt, breached },
            });

            if (breached) {
                await this.prisma.incident.update({
                    where: { id: incidentId },
                    data: { slaBreached: true },
                });
            }
        }
    }

    async markResolutionCompleted(incidentId: string, completedAt: Date) {
        const record = await this.prisma.slaRecord.findFirst({
            where: { incidentId, type: 'resolution' },
        });

        if (record) {
            const breached = completedAt > record.deadline;
            await this.prisma.slaRecord.update({
                where: { id: record.id },
                data: { completedAt, breached },
            });

            if (breached) {
                await this.prisma.incident.update({
                    where: { id: incidentId },
                    data: { slaBreached: true },
                });
            }
        }
    }

    // Check for SLA breaches every 5 minutes
    @Cron(CronExpression.EVERY_5_MINUTES)
    async checkSlaBreaches() {
        this.logger.debug('Checking for SLA breaches...');

        const now = new Date();

        // Find SLA records that are past deadline and not completed
        const breachedRecords = await this.prisma.slaRecord.findMany({
            where: {
                completedAt: null,
                deadline: { lt: now },
                breached: false,
            },
            include: { incident: true },
        });

        for (const record of breachedRecords) {
            await this.prisma.slaRecord.update({
                where: { id: record.id },
                data: { breached: true },
            });

            await this.prisma.incident.update({
                where: { id: record.incidentId },
                data: { slaBreached: true },
            });

            this.logger.warn(`SLA breach detected for incident ${record.incident.number}`);

            // TODO: Send notification for SLA breach
        }

        if (breachedRecords.length > 0) {
            this.logger.log(`${breachedRecords.length} SLA breach(es) detected`);
        }
    }

    async createDefaultSlaDefinitions() {
        const defaults = [
            {
                name: 'Critical SLA',
                priority: IncidentPriority.CRITICAL,
                responseTimeMinutes: 15,
                resolutionTimeMinutes: 60,
            },
            {
                name: 'High Priority SLA',
                priority: IncidentPriority.HIGH,
                responseTimeMinutes: 30,
                resolutionTimeMinutes: 240,
            },
            {
                name: 'Medium Priority SLA',
                priority: IncidentPriority.MEDIUM,
                responseTimeMinutes: 60,
                resolutionTimeMinutes: 480,
            },
            {
                name: 'Low Priority SLA',
                priority: IncidentPriority.LOW,
                responseTimeMinutes: 240,
                resolutionTimeMinutes: 1440,
            },
        ];

        for (const def of defaults) {
            await this.prisma.slaDefinition.upsert({
                where: { name: def.name },
                update: {},
                create: def,
            });
        }

        this.logger.log('Default SLA definitions created');
    }
}
