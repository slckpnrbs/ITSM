import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('incidents/:incidentId/messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Get()
    async getMessages(
        @Param('incidentId') incidentId: string,
        @Query('includeInternal') includeInternal?: string,
    ) {
        if (includeInternal === 'true') {
            return this.messageService.findByIncident(incidentId);
        }
        return this.messageService.findPublicByIncident(incidentId);
    }

    @Post()
    async createMessage(
        @Param('incidentId') incidentId: string,
        @Body() body: {
            senderId: string;
            senderName: string;
            senderType?: string;
            content: string;
            isInternal?: boolean;
        },
    ) {
        return this.messageService.create(incidentId, body);
    }
}
