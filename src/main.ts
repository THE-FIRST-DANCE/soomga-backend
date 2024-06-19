import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerSetup } from './swagger';
import { ConfigService } from '@nestjs/config';
import {
  BaseConfig,
  CorsConfig,
  NestConfig,
  RedisConfig,
  SecurityConfig,
} from './configs/config.interface';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RedisIoAdapter } from './modules/redis/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  app.setGlobalPrefix('api'); // 모든 라우트에 /api를 기본 경로로 설정

  const config = app.get<ConfigService>(ConfigService);
  const nest = config.get<NestConfig>('nest');
  const security = config.get<SecurityConfig>('security');
  const cors = config.get<CorsConfig>('cors');
  const base = config.get<BaseConfig>('base');
  const redis = config.get<RedisConfig>('redis');

  if (cors.enabled) {
    app.enableCors({
      origin: base.frontendUrl.split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization, Tracking-Id',
      credentials: true,
    });
  }

  app.use(cookieParser());
  // app.use(
  //   session({
  //     secret: security.sessionSecret,
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );

  const redisIoAdapter = new RedisIoAdapter(app, redis.host, redis.port);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalPipes(new ValidationPipe());

  swaggerSetup(app);

  await app.listen(nest.port);
  const appUrl = await app.getUrl();
  console.log(`Server is running on: ${appUrl}`);
}
bootstrap();
