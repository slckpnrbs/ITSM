import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('NotificationService');

    // CORS
    app.enableCors();

    const port = process.env.PORT || 3003;
    await app.listen(port);

    logger.log(`🔔 Notification Service is running on http://localhost:${port}`);
}

bootstrap();
