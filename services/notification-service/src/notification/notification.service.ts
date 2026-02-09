import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { NotificationGateway } from '../websocket/notification.gateway';

export interface Notification {
    type: 'email' | 'websocket' | 'both';
    event: string;
    userId?: string;
    email?: string;
    data: any;
}

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly emailService: EmailService,
        private readonly gateway: NotificationGateway,
    ) { }

    async send(notification: Notification) {
        try {
            switch (notification.event) {
                case 'incident:created':
                    return this.handleIncidentCreated(notification);
                case 'incident:assigned':
                    return this.handleIncidentAssigned(notification);
                case 'incident:resolved':
                    return this.handleIncidentResolved(notification);
                case 'incident:message':
                    return this.handleNewMessage(notification);
                case 'sla:breach':
                    return this.handleSlaBreachWarning(notification);
                default:
                    this.logger.warn(`Unknown notification event: ${notification.event}`);
            }
        } catch (error) {
            this.logger.error(`Failed to send notification: ${notification.event}`, error);
        }
    }

    private async handleIncidentCreated(notification: Notification) {
        const { incidentId, incidentNumber, subject, reporterEmail } = notification.data;

        // WebSocket notification
        this.gateway.notifyIncidentCreated(incidentId, incidentNumber, subject);

        // Email notification
        if (notification.type !== 'websocket' && reporterEmail) {
            await this.emailService.sendIncidentCreatedEmail(reporterEmail, incidentNumber, subject);
        }
    }

    private async handleIncidentAssigned(notification: Notification) {
        const { incidentId, incidentNumber, assigneeId, assigneeName, reporterEmail } = notification.data;

        // WebSocket notification
        this.gateway.notifyIncidentAssigned(incidentId, assigneeId, assigneeName);

        // Email notification
        if (notification.type !== 'websocket' && reporterEmail) {
            await this.emailService.sendIncidentAssignedEmail(reporterEmail, incidentNumber, assigneeName);
        }
    }

    private async handleIncidentResolved(notification: Notification) {
        const { incidentId, incidentNumber, reporterEmail } = notification.data;

        // WebSocket notification
        this.gateway.sendToIncident(incidentId, 'incident:resolved', { incidentId, incidentNumber });

        // Email notification
        if (notification.type !== 'websocket' && reporterEmail) {
            await this.emailService.sendIncidentResolvedEmail(reporterEmail, incidentNumber);
        }
    }

    private async handleNewMessage(notification: Notification) {
        const { incidentId, message } = notification.data;

        // WebSocket only for real-time messages
        this.gateway.notifyNewMessage(incidentId, message);
    }

    private async handleSlaBreachWarning(notification: Notification) {
        const { incidentId, incidentNumber, assigneeId, assigneeEmail, deadline } = notification.data;

        // WebSocket notification
        if (assigneeId) {
            this.gateway.notifySlaWarning(assigneeId, incidentId, incidentNumber, deadline);
        }

        // Email notification
        if (notification.type !== 'websocket' && assigneeEmail) {
            await this.emailService.sendSlaBreachWarning(assigneeEmail, incidentNumber, deadline);
        }
    }
}
