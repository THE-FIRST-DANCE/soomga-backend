import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsDto } from './dto/events.dto';

@Injectable()
export class EventsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent(data: EventsDto) {
    try {
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
    } catch (error) {
      throw new Error('Failed to create event');
    }
  }

  async getEvents(memberId: number) {
    try {
      return await this.prismaService.memberEvent.findMany({
        where: {
          memberId,
        },
      });
    } catch (error) {
      throw new Error('Failed to get events');
    }
  }

  async deleteEvent(eventId: number) {
    try {
      return await this.prismaService.memberEvent.delete({
        where: {
          id: eventId,
        },
      });
    } catch (error) {
      throw new Error('Failed to delete event');
    }
  }

  async updateEvent(eventId: number, data: EventsDto) {
    try {
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
    } catch (error) {
      throw new Error('Failed to update event');
    }
  }
}
