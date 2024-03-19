import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { CoolsmsModule } from '../coolsms/coolsms.module';
import { GuidesModule } from '../guides/guides.module';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { LoggerModule } from '../logger/logger.module';
import { MembersModule } from '../members/members.module';
import { PlacesModule } from '../places/places.module';
import { PlansModule } from 'src/plans/plans.module';

import { GLOBAL_CONFIG } from '../../configs/global.config';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { AdminModule } from '../admin/admin.module';
import { HealthModule } from '../health/health.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    EventsModule,
    PlansModule,
    PlacesModule,
    AuthModule,
    AdminModule,
    GuidesModule,
    MembersModule,
    LoggerModule,
    CoolsmsModule,
    HealthModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService,
      ): Promise<CacheModuleOptions> => {
        // try {
        //   const redis = await redisStore({
        //     ttl: 30_000,
        //     socket: {
        //       host: configService.get('REDIS_HOST'),
        //       port: configService.get('REDIS_PORT'),
        //     },
        //   });
        //   return { store: redis };
        // } catch (error) {
        //   console.error(
        //     'Failed to connect to Redis, using in-memory cache instead.',
        //     error,
        //   );
        return { store: 'memory', ttl: 30_000 };
        // }
      },
      inject: [ConfigService],
    }),
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
