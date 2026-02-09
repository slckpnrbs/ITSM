import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IncidentController } from './incident/incident.controller';
import { IncidentService } from './incident/incident.service';
import { SlaService } from './sla/sla.service';
import { SlaController } from './sla/sla.controller';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { EmailListenerService } from './email/email-listener.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
    ],
    controllers: [
        IncidentController,
        SlaController,
        MessageController,
    ],
    providers: [
        IncidentService,
        SlaService,
        MessageService,
        EmailListenerService,
        PrismaService,
    ],
})
export class AppModule { }
