import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerSetup } from './swagger';
import { ConfigService } from '@nestjs/config';
import { NestConfig } from './configs/config.interface';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');

  swaggerSetup(app);

  await app.listen(nestConfig.port, () => {
    console.log(`Server is running on: ${nestConfig.port}`);
  });
}
bootstrap();
