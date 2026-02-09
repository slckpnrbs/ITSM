import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'gateway',
        };
    }

    getInfo() {
        return {
            name: 'ITSM Platform Gateway',
            version: '0.1.0',
            description: 'API Gateway for ITSM Microservices',
            services: [
                { name: 'auth-service', path: '/api/auth' },
                { name: 'incident-service', path: '/api/incidents' },
                { name: 'notification-service', path: '/api/notifications' },
            ],
        };
    }
}
