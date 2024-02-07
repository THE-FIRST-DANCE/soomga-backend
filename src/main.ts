import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerSetup } from './swagger';
import { ConfigService } from '@nestjs/config';
import { NestConfig } from './configs/config.interface';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  // FIXME: CORS 설정은 나중에 변경할 예정
  app.enableCors({
    origin: 'http://localhost:5173', // specify the allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // specify the allowed methods
    allowedHeaders: 'Content-Type, Accept', // specify the allowed headers
    credentials: true, // enable passing of cookies from the client to the server
  });

  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');

  swaggerSetup(app);

  await app.listen(nestConfig.port);
  console.log(`Server is running on: ${nestConfig.port}`);
}
bootstrap();
