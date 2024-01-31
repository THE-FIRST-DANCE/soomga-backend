import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './configs/config.interface';

export function swaggerSetup(app: INestApplication) {
  const configService = app.get<ConfigService>(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'NestJS API')
      .setDescription(swaggerConfig.description || 'NestJS API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path, app, document);
    console.log(`Swagger is running on: ${swaggerConfig.path}`);
  }
}
