import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(private readonly prisma: PrismaService) { }

    async create(incidentId: string, data: {
        senderId: string;
        senderName: string;
        senderType?: string;
        content: string;
        isInternal?: boolean;
    }) {
        return this.prisma.message.create({
            data: {
                incidentId,
                senderId: data.senderId,
                senderName: data.senderName,
                senderType: data.senderType || 'user',
                content: data.content,
                isInternal: data.isInternal || false,
            },
        });
    }

    async findByIncident(incidentId: string) {
        return this.prisma.message.findMany({
            where: { incidentId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async findPublicByIncident(incidentId: string) {
        return this.prisma.message.findMany({
            where: { incidentId, isInternal: false },
            orderBy: { createdAt: 'asc' },
        });
    }
}
