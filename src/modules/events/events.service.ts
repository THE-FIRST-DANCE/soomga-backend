import { Injectable } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { EventsDto } from './dto/events.dto';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async createEvent(data: EventsDto) {
    return await this.eventsRepository.createEvent(data);
  }

  async getEvents(memberId: number) {
    return await this.eventsRepository.getEvents(memberId);
  }

  async deleteEvent(eventId: number) {
    return await this.eventsRepository.deleteEvent(eventId);
  }

  async updateEvent(eventId: number, data: EventsDto) {
    return await this.eventsRepository.updateEvent(eventId, data);
  }
}
