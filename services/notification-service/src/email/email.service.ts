import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || 'ITSM Platform <noreply@itsm.local>',
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            this.logger.log(`Email sent: ${info.messageId}`);
            return true;
        } catch (error) {
            this.logger.error('Failed to send email', error);
            return false;
        }
    }

    async sendIncidentCreatedEmail(to: string, incidentNumber: string, subject: string) {
        return this.sendEmail({
            to,
            subject: `[${incidentNumber}] Olay Kaydı Oluşturuldu`,
            html: `
        <h2>Olay Kaydınız Oluşturuldu</h2>
        <p>Sayın kullanıcı,</p>
        <p><strong>${incidentNumber}</strong> numaralı olay kaydınız başarıyla oluşturulmuştur.</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p>Olay durumunuz hakkında güncellemeler e-posta ile tarafınıza iletilecektir.</p>
        <hr/>
        <p><small>Bu e-posta otomatik olarak gönderilmiştir.</small></p>
      `,
        });
    }

    async sendIncidentAssignedEmail(to: string, incidentNumber: string, assigneeName: string) {
        return this.sendEmail({
            to,
            subject: `[${incidentNumber}] Olay Atandı`,
            html: `
        <h2>Olay Kaydınız Atandı</h2>
        <p><strong>${incidentNumber}</strong> numaralı olay kaydınız <strong>${assigneeName}</strong> kişisine atanmıştır.</p>
        <p>En kısa sürede sizinle iletişime geçilecektir.</p>
      `,
        });
    }

    async sendIncidentResolvedEmail(to: string, incidentNumber: string) {
        return this.sendEmail({
            to,
            subject: `[${incidentNumber}] Olay Çözüldü`,
            html: `
        <h2>Olay Kaydınız Çözüldü</h2>
        <p><strong>${incidentNumber}</strong> numaralı olay kaydınız çözülmüştür.</p>
        <p>Lütfen memnuniyet anketimizi doldurmayı unutmayınız.</p>
      `,
        });
    }

    async sendSlaBreachWarning(to: string, incidentNumber: string, deadline: Date) {
        return this.sendEmail({
            to,
            subject: `⚠️ [${incidentNumber}] SLA İhlali Uyarısı`,
            html: `
        <h2 style="color: #dc3545;">SLA İhlali Uyarısı</h2>
        <p><strong>${incidentNumber}</strong> numaralı olay kaydı için SLA ihlali tespit edilmiştir.</p>
        <p><strong>Son Tarih:</strong> ${deadline.toLocaleString('tr-TR')}</p>
        <p>Lütfen acil olarak müdahale ediniz.</p>
      `,
        });
    }
}
