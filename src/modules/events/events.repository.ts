import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsDto } from './dto/events.dto';

@Injectable()
export class EventsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent(data: EventsDto) {
    const { memberId, title, start, end, allDay, description } = data;

    const startEvent = new Date(start);
    const endEvent = new Date(end);

    return await this.prismaService.memberEvent.create({
      data: {
        memberId,
        title,
        start: startEvent,
        end: endEvent,
        allDay,
        description,
      },
    });
  }

  async getEvents(memberId: number) {
    return await this.prismaService.memberEvent.findMany({
      where: {
        memberId,
      },
    });
  }

  async deleteEvent(eventId: number) {
    return await this.prismaService.memberEvent.delete({
      where: {
        id: eventId,
      },
    });
  }

  async updateEvent(eventId: number, data: EventsDto) {
    const { memberId, title, start, end, allDay, description } = data;

    const startEvent = new Date(start);
    const endEvent = new Date(end);

    return await this.prismaService.memberEvent.update({
      where: {
        id: eventId,
      },
      data: {
        memberId,
        title,
        start: startEvent,
        end: endEvent,
        allDay,
        description,
      },
    });
  }
}
