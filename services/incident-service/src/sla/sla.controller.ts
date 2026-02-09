import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlaService } from './sla.service';

@Controller('sla')
export class SlaController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly slaService: SlaService,
    ) { }

    @Get()
    async findAll() {
        return this.prisma.slaDefinition.findMany({
            orderBy: { responseTimeMinutes: 'asc' },
        });
    }

    @Post('seed')
    async seedDefaults() {
        await this.slaService.createDefaultSlaDefinitions();
        return { message: 'Default SLA definitions created' };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: {
            responseTimeMinutes?: number;
            resolutionTimeMinutes?: number;
            isActive?: boolean;
        },
    ) {
        return this.prisma.slaDefinition.update({
            where: { id },
            data,
        });
    }
}
