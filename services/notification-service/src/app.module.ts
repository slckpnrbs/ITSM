import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationGateway } from './websocket/notification.gateway';

@Module({
    imports: [],
    controllers: [NotificationController],
    providers: [
        EmailService,
        NotificationService,
        NotificationGateway,
    ],
})
export class AppModule { }
