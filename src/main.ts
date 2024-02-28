import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerSetup } from './swagger';
import { ConfigService } from '@nestjs/config';
import { BaseConfig, CorsConfig, NestConfig } from './configs/config.interface';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  const config = app.get<ConfigService>(ConfigService);
  const nest = config.get<NestConfig>('nest');
  const cors = config.get<CorsConfig>('cors');
  const base = config.get<BaseConfig>('base');

  if (cors.enabled) {
    app.enableCors({
      origin: base.frontendUrl,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      credentials: true,
    });
  }

  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  swaggerSetup(app);

  await app.listen(nest.port);
  console.log(`Server is running on: ${nest.port}`);
}
bootstrap();
