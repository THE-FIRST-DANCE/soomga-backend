import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisHealthModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule, RedisHealthModule],
  controllers: [HealthController],
})
export class HealthModule {}
