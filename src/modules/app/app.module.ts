import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { CoolsmsModule } from '../coolsms/coolsms.module';
import { GuidesModule } from '../guides/guides.module';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { LoggerModule } from '../logger/logger.module';
import { MembersModule } from '../members/members.module';
import { PlacesModule } from '../places/places.module';

import { AdminModule } from '../admin/admin.module';
import { HealthModule } from '../health/health.module';
import { EventsModule } from '../events/events.module';
import { ChatModule } from '../chat/chat.module';
import { RedisConfig } from '../../configs/config.interface';
import { BoardsModule } from '../boards/boards.module';
import { TagsModule } from '../tags/tags.module';
import { PlansModule } from '../plans/plans.module';

import { GLOBAL_CONFIG } from '../../configs/global.config';
import { UploadsModule } from '../uploads/uploads.module';
import { envValidateSchema } from 'src/configs/env-validate.schema';
import { AreasModule } from '../areas/areas.module';
import { MypageModule } from '../mypage/mypage.module';
import { ServicesModule } from '../services/services.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { PersonalizeModule } from '../personalize/personalize.module';

@Module({
  imports: [
    UploadsModule,
    EventsModule,
    PlansModule,
    PlacesModule,
    AuthModule,
    AdminModule,
    BoardsModule,
    AreasModule,
    MypageModule,
    TagsModule,
    GuidesModule,
    MembersModule,
    LoggerModule,
    CoolsmsModule,
    HealthModule,
    ChatModule,
    ServicesModule,
    ReservationsModule,
    PersonalizeModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const { host, port } = configService.get<RedisConfig>('redis');

        const tlsOptions =
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : undefined;

        return {
          type: 'single',
          url: `redis://${host}:${port}`,
          options: {
            host,
            port,
            tls: tlsOptions,
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envValidateSchema.validateAsync(GLOBAL_CONFIG)],
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
