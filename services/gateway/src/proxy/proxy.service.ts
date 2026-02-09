import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);

    constructor(private readonly httpService: HttpService) { }

    async forward(
        serviceUrl: string,
        method: string,
        path: string,
        body?: any,
        headers?: Record<string, string>,
        params?: Record<string, any>,
    ) {
        const url = `${serviceUrl}${path}`;

        const config: AxiosRequestConfig = {
            method,
            url,
            data: body,
            params,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        };

        try {
            this.logger.debug(`Forwarding ${method} ${url}`);
            const response = await firstValueFrom(this.httpService.request(config));
            return response.data;
        } catch (error) {
            this.logger.error(`Proxy error: ${error.message}`);

            if (error.response) {
                throw new HttpException(
                    error.response.data,
                    error.response.status,
                );
            }

            throw new HttpException('Service unavailable', 503);
        }
    }
}
