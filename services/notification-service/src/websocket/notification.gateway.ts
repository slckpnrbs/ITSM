import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface ConnectedClient {
    socket: Socket;
    userId: string;
    rooms: string[];
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationGateway.name);
    private clients: Map<string, ConnectedClient> = new Map();

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.clients.delete(client.id);
    }

    @SubscribeMessage('authenticate')
    handleAuthenticate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userId: string },
    ) {
        this.clients.set(client.id, {
            socket: client,
            userId: data.userId,
            rooms: [],
        });

        // Join user's personal room
        client.join(`user:${data.userId}`);
        this.logger.log(`User ${data.userId} authenticated`);

        return { success: true };
    }

    @SubscribeMessage('joinIncident')
    handleJoinIncident(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { incidentId: string },
    ) {
        const roomName = `incident:${data.incidentId}`;
        client.join(roomName);

        const clientData = this.clients.get(client.id);
        if (clientData) {
            clientData.rooms.push(roomName);
        }

        this.logger.log(`Client ${client.id} joined room ${roomName}`);
        return { success: true };
    }

    @SubscribeMessage('leaveIncident')
    handleLeaveIncident(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { incidentId: string },
    ) {
        const roomName = `incident:${data.incidentId}`;
        client.leave(roomName);

        const clientData = this.clients.get(client.id);
        if (clientData) {
            clientData.rooms = clientData.rooms.filter(r => r !== roomName);
        }

        return { success: true };
    }

    // Send notification to specific user
    sendToUser(userId: string, event: string, data: any) {
        this.server.to(`user:${userId}`).emit(event, data);
    }

    // Send notification to all clients in an incident room
    sendToIncident(incidentId: string, event: string, data: any) {
        this.server.to(`incident:${incidentId}`).emit(event, data);
    }

    // Broadcast to all connected clients
    broadcast(event: string, data: any) {
        this.server.emit(event, data);
    }

    // Notification events
    notifyIncidentCreated(incidentId: string, incidentNumber: string, subject: string) {
        this.broadcast('incident:created', { incidentId, incidentNumber, subject });
    }

    notifyIncidentUpdated(incidentId: string, changes: any) {
        this.sendToIncident(incidentId, 'incident:updated', { incidentId, changes });
    }

    notifyNewMessage(incidentId: string, message: any) {
        this.sendToIncident(incidentId, 'incident:message', { incidentId, message });
    }

    notifyIncidentAssigned(incidentId: string, assigneeId: string, assigneeName: string) {
        this.sendToUser(assigneeId, 'incident:assigned', { incidentId, assigneeName });
        this.sendToIncident(incidentId, 'incident:statusChange', {
            incidentId,
            status: 'assigned',
            assigneeName,
        });
    }

    notifySlaWarning(userId: string, incidentId: string, incidentNumber: string, deadline: Date) {
        this.sendToUser(userId, 'sla:warning', {
            incidentId,
            incidentNumber,
            deadline,
            message: `SLA ihlali yaklaşıyor: ${incidentNumber}`,
        });
    }
}
