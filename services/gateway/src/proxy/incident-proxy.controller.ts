import { Controller, All, Req, Body, Headers } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller('incidents')
export class IncidentProxyController {
    private readonly serviceUrl = process.env.INCIDENT_SERVICE_URL || 'http://localhost:3002';

    constructor(private readonly proxyService: ProxyService) { }

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
