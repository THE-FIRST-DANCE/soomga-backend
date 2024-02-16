import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/configs/global.config';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { LoggerModule } from '../logger/logger.module';
import { MembersModule } from '../members/members.module';
import { AuthModule } from '../auth/auth.module';
import { PlacesModule } from '../places/places.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    PlacesModule,
    AuthModule,
    MembersModule,
    LoggerModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
