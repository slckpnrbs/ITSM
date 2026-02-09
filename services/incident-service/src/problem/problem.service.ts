import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProblemDto, UpdateProblemDto } from './dto/problem.dto';
import { ProblemStatus, IncidentStatus } from '@prisma/client';

@Injectable()
export class ProblemService {
    constructor(private prisma: PrismaService) { }

    async create(createProblemDto: CreateProblemDto, userId: string, userName: string) {
        const { incidentIds, ...data } = createProblemDto;

        // Generate problem number (PRB-XXXXXX)
        const count = await this.prisma.problem.count();
        const number = `PRB-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.problem.create({
            data: {
                ...data,
                number,
                createdById: userId,
                createdByName: userName,
                incidents: {
                    connect: incidentIds.map(id => ({ id })),
                },
            },
            include: {
                incidents: {
                    select: { id: true, number: true, subject: true }
                }
            }
        });
    }

    async findAll(filter?: { status?: ProblemStatus; assigneeId?: string }) {
        return this.prisma.problem.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { incidents: true }
                }
            }
        });
    }

    async findOne(id: string) {
        const problem = await this.prisma.problem.findUnique({
            where: { id },
            include: {
                incidents: {
                    select: { id: true, number: true, subject: true, status: true, priority: true }
                }
            },
        });
        if (!problem) throw new NotFoundException(`Problem #${id} not found`);
        return problem;
    }

    async update(id: string, updateProblemDto: UpdateProblemDto, userId: string) {
        const problem = await this.prisma.problem.findUnique({ where: { id } });
        if (!problem) throw new NotFoundException(`Problem #${id} not found`);

        const updatedProblem = await this.prisma.problem.update({
            where: { id },
            data: {
                ...updateProblemDto,
                // Set resolvedAt/closedAt if status changes
                resolvedAt: updateProblemDto.status === ProblemStatus.RESOLVED && problem.status !== ProblemStatus.RESOLVED ? new Date() : undefined,
                closedAt: updateProblemDto.status === ProblemStatus.CLOSED && problem.status !== ProblemStatus.CLOSED ? new Date() : undefined
            },
        });

        // Auto-resolve/close linked incidents if configured
        if (updatedProblem.status === ProblemStatus.RESOLVED || updatedProblem.status === ProblemStatus.CLOSED) {
            await this.handleAutoResolution(id, updatedProblem.status);
        }

        return updatedProblem;
    }

    private async handleAutoResolution(problemId: string, status: ProblemStatus) {
        const targetStatus = status === ProblemStatus.RESOLVED ? IncidentStatus.RESOLVED : IncidentStatus.CLOSED;

        await this.prisma.incident.updateMany({
            where: {
                problemId,
                status: { not: targetStatus }
            },
            data: {
                status: targetStatus,
                resolvedAt: status === ProblemStatus.RESOLVED ? new Date() : undefined,
                closedAt: status === ProblemStatus.CLOSED ? new Date() : undefined
            }
        });
    }

    async addIncident(problemId: string, incidentId: string) {
        return this.prisma.problem.update({
            where: { id: problemId },
            data: {
                incidents: {
                    connect: { id: incidentId }
                }
            }
        });
    }

    async removeIncident(problemId: string, incidentId: string) {
        return this.prisma.problem.update({
            where: { id: problemId },
            data: {
                incidents: {
                    disconnect: { id: incidentId }
                }
            }
        });
    }
}
