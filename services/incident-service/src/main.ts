import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('IncidentService');

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));

    // CORS
    app.enableCors();

    const port = process.env.PORT || 3002;
    await app.listen(port);

    logger.log(`🎫 Incident Service is running on http://localhost:${port}`);
}

bootstrap();
