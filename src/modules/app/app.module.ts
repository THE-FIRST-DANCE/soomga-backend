import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/configs/global.config';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfig } from 'src/configs/config.interface';
import { LoggerModule } from '../logger/logger.module';
import { MembersModule } from '../members/members.module';
import { AuthModule } from '../auth/auth.module';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [
    PlacesModule,
    AuthModule,
    MembersModule,
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis');
        return {
          config: redisConfig,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
