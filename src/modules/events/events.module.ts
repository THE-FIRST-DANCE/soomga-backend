import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [EventsService, EventsRepository, PrismaService],
  controllers: [EventsController],
})
export class EventsModule {}
