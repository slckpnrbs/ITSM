import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationService, Notification } from './notification.service';

@Controller()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get('health')
    getHealth() {
        return {
            status: 'ok',
            service: 'notification-service',
            timestamp: new Date().toISOString(),
        };
    }

    @Post('send')
    async sendNotification(@Body() notification: Notification) {
        await this.notificationService.send(notification);
        return { success: true };
    }

    @Post('incident/created')
    async notifyIncidentCreated(@Body() data: {
        incidentId: string;
        incidentNumber: string;
        subject: string;
        reporterEmail: string;
    }) {
        await this.notificationService.send({
            type: 'both',
            event: 'incident:created',
            data,
        });
        return { success: true };
    }

    @Post('incident/assigned')
    async notifyIncidentAssigned(@Body() data: {
        incidentId: string;
        incidentNumber: string;
        assigneeId: string;
        assigneeName: string;
        reporterEmail: string;
    }) {
        await this.notificationService.send({
            type: 'both',
            event: 'incident:assigned',
            data,
        });
        return { success: true };
    }

    @Post('incident/resolved')
    async notifyIncidentResolved(@Body() data: {
        incidentId: string;
        incidentNumber: string;
        reporterEmail: string;
    }) {
        await this.notificationService.send({
            type: 'both',
            event: 'incident:resolved',
            data,
        });
        return { success: true };
    }

    @Post('sla/warning')
    async notifySlaWarning(@Body() data: {
        incidentId: string;
        incidentNumber: string;
        assigneeId: string;
        assigneeEmail: string;
        deadline: Date;
    }) {
        await this.notificationService.send({
            type: 'both',
            event: 'sla:breach',
            data,
        });
        return { success: true };
    }
}
