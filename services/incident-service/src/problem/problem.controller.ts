import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto, UpdateProblemDto } from './dto/problem.dto';
import { ProblemStatus } from '@prisma/client';

@Controller('problems')
export class ProblemController {
    constructor(private readonly problemService: ProblemService) { }

    @Post()
    create(@Body() createProblemDto: CreateProblemDto) {
        // TODO: Get user from request (AuthGuard)
        const userId = 'system-user';
        const userName = 'System User';
        return this.problemService.create(createProblemDto, userId, userName);
    }

    @Get()
    findAll(
        @Query('status') status?: ProblemStatus,
        @Query('assigneeId') assigneeId?: string,
    ) {
        return this.problemService.findAll({ status, assigneeId });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.problemService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
        // TODO: Get user from request
        const userId = 'system-user';
        return this.problemService.update(id, updateProblemDto, userId);
    }

    @Post(':id/incidents')
    addIncident(@Param('id') id: string, @Body('incidentId') incidentId: string) {
        return this.problemService.addIncident(id, incidentId);
    }

    @Delete(':id/incidents/:incidentId')
    removeIncident(@Param('id') id: string, @Param('incidentId') incidentId: string) {
        return this.problemService.removeIncident(id, incidentId);
    }
}
