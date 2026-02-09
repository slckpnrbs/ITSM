import { Controller, All, Req, Body, Headers, Get, Post, Patch, Delete } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller('problems')
export class ProblemProxyController {
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
            '/problems',
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
            '/problems',
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
        const path = req.path.replace('/api/problems', '/problems');
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
