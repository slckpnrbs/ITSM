import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IncidentService } from '../incident/incident.service';
import { IncidentPriority } from '@prisma/client';

// Note: In production, you would use actual IMAP library
// This is a simplified implementation showing the structure

interface EmailMessage {
    messageId: string;
    from: string;
    fromName: string;
    subject: string;
    body: string;
    date: Date;
}

@Injectable()
export class EmailListenerService implements OnModuleInit {
    private readonly logger = new Logger(EmailListenerService.name);
    private isListening = false;

    constructor(private readonly incidentService: IncidentService) { }

    onModuleInit() {
        if (process.env.EMAIL_LISTENER_ENABLED === 'true') {
            this.startListening();
        }
    }

    private startListening() {
        this.isListening = true;
        this.logger.log('Email listener started');
        // In production: Connect to IMAP server here
    }

    // Check for new emails every minute
    @Cron(CronExpression.EVERY_MINUTE)
    async pollEmails() {
        if (!this.isListening) return;

        try {
            // In production: Fetch new emails from IMAP server
            const emails = await this.fetchNewEmails();

            for (const email of emails) {
                await this.processEmail(email);
            }
        } catch (error) {
            this.logger.error('Error polling emails', error);
        }
    }

    private async fetchNewEmails(): Promise<EmailMessage[]> {
        // Placeholder - In production:
        // 1. Connect to IMAP using configured credentials
        // 2. Search for unseen emails
        // 3. Parse them using mailparser
        // 4. Mark as seen after processing
        return [];
    }

    async processEmail(email: EmailMessage) {
        this.logger.log(`Processing email: ${email.subject} from ${email.from}`);

        // Check if email already processed
        // (implement deduplication based on messageId)

        // Analyze email content to determine priority
        const priority = this.analyzePriority(email.subject, email.body);

        // Create incident from email
        const incident = await this.incidentService.create({
            subject: `[Email] ${email.subject}`,
            description: this.formatEmailBody(email),
            priority,
            reporterId: 'email-system',
            reporterEmail: email.from,
            reporterName: email.fromName || email.from,
            source: 'email',
            emailMessageId: email.messageId,
        });

        this.logger.log(`Created incident ${incident.number} from email`);

        // TODO: Send auto-reply confirmation email

        return incident;
    }

    private analyzePriority(subject: string, body: string): IncidentPriority {
        const content = `${subject} ${body}`.toLowerCase();

        // Keywords for priority detection
        const criticalKeywords = ['urgent', 'critical', 'emergency', 'down', 'outage', 'acil'];
        const highKeywords = ['important', 'asap', 'high priority', 'önemli'];

        if (criticalKeywords.some(kw => content.includes(kw))) {
            return IncidentPriority.CRITICAL;
        }
        if (highKeywords.some(kw => content.includes(kw))) {
            return IncidentPriority.HIGH;
        }

        return IncidentPriority.MEDIUM;
    }

    private formatEmailBody(email: EmailMessage): string {
        return `
**Email Received**
- From: ${email.fromName} <${email.from}>
- Date: ${email.date.toISOString()}

---

${email.body}
    `.trim();
    }
}
