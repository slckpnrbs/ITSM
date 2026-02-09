import { Controller, All, Req, Body, Headers, Get, Post } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller('incidents')
export class IncidentProxyController {
    private readonly serviceUrl = process.env.INCIDENT_SERVICE_URL || 'http://localhost:3002';

    constructor(private readonly proxyService: ProxyService) { }

    @Get()
    async getAll(
        @Req() req: Request,
        @Headers() headers: Record<string, string>,
    ) {
        return this.proxyService.forward(
            this.serviceUrl,
            'GET',
            '/incidents',
            null,
            { authorization: headers.authorization },
            req.query as Record<string, any>,
        );
    }

    @Post()
    async create(
        @Req() req: Request,
        @Body() body: any,
        @Headers() headers: Record<string, string>,
    ) {
        return this.proxyService.forward(
            this.serviceUrl,
            'POST',
            '/incidents',
            body,
            { authorization: headers.authorization },
        );
    }

    @All('*')
    async proxy(
        @Req() req: Request,
        @Body() body: any,
        @Headers() headers: Record<string, string>,
    ) {
        const path = req.path.replace('/api/incidents', '/incidents');
        return this.proxyService.forward(
            this.serviceUrl,
            req.method,
            path,
            req.method === 'GET' ? null : body,
            { authorization: headers.authorization },
            req.method === 'GET' ? req.query as Record<string, any> : undefined,
        );
    }
}


