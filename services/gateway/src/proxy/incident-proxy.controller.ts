import { Controller, All, Req, Body, Headers, Get, Post, Put, Delete, Patch } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller('incidents')
export class IncidentProxyController {
    private readonly serviceUrl = process.env.INCIDENT_SERVICE_URL || 'http://localhost:3002';

    constructor(private readonly proxyService: ProxyService) { }

    // Root path handlers
    @Get()
    async getAll(
        @Req() req: Request,
        @Headers() headers: Record<string, string>,
    ) {
        return this.proxyService.forward(
            this.serviceUrl,
            'GET',
            '/',
            null,
            { authorization: headers.authorization },
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
            '/',
            body,
            { authorization: headers.authorization },
        );
    }

    // Wildcard for sub-paths
    @All('*')
    async proxy(
        @Req() req: Request,
        @Body() body: any,
        @Headers() headers: Record<string, string>,
    ) {
        const path = req.path.replace('/api/incidents', '');
        return this.proxyService.forward(
            this.serviceUrl,
            req.method,
            path || '/',
            body,
            { authorization: headers.authorization },
        );
    }
}

