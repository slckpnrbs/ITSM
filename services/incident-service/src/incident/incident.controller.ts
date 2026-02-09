import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { QueryIncidentDto } from './dto/query-incident.dto';

@Controller('incidents')
export class IncidentController {
    constructor(private readonly incidentService: IncidentService) { }

    @Get('health')
    getHealth() {
        return {
            status: 'ok',
            service: 'incident-service',
            timestamp: new Date().toISOString(),
        };
    }

    @Post()
    async create(@Body() createIncidentDto: CreateIncidentDto) {
        return this.incidentService.create(createIncidentDto);
    }

    @Get()
    async findAll(@Query() query: QueryIncidentDto) {
        return this.incidentService.findAll(query);
    }

    @Get('stats')
    async getStats() {
        return this.incidentService.getStats();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.incidentService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateIncidentDto: UpdateIncidentDto,
    ) {
        return this.incidentService.update(id, updateIncidentDto);
    }

    @Put(':id/assign')
    async assign(
        @Param('id') id: string,
        @Body() body: { assigneeId: string; assigneeName: string },
    ) {
        return this.incidentService.assign(id, body.assigneeId, body.assigneeName);
    }

    @Put(':id/resolve')
    async resolve(@Param('id') id: string) {
        return this.incidentService.resolve(id);
    }

    @Put(':id/close')
    async close(@Param('id') id: string) {
        return this.incidentService.close(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string) {
        return this.incidentService.delete(id);
    }

    @Post(':id/survey')
    async submitSurvey(
        @Param('id') id: string,
        @Body() body: { rating: number; comment?: string; submittedBy: string },
    ) {
        return this.incidentService.submitSurvey(id, body);
    }
}
