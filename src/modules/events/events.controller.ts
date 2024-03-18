import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsDto } from './dto/events.dto';
import { MemberEvent } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('이벤트 API')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: '이벤트 생성',
    description: '새로운 이벤트를 생성합니다.',
  })
  @Post()
  async createEvent(@Body() data: EventsDto): Promise<MemberEvent> {
    return await this.eventsService.createEvent(data);
  }

  @ApiOperation({
    summary: '이벤트 조회',
    description: '회원의 이벤트를 조회합니다.',
  })
  @Get()
  async getEvents(
    @Query() param: { memberId: number },
  ): Promise<MemberEvent[]> {
    return await this.eventsService.getEvents(Number(param.memberId));
  }

  @ApiOperation({
    summary: '이벤트 삭제',
    description: '이벤트를 삭제합니다.',
  })
  @Delete(':eventId')
  async deleteEvent(@Param('eventId') eventId: number): Promise<MemberEvent> {
    return await this.eventsService.deleteEvent(Number(eventId));
  }

  @ApiOperation({
    summary: '이벤트 수정',
    description: '이벤트를 수정합니다.',
  })
  @Post(':eventId')
  async updateEvent(
    @Param('eventId') eventId: number,
    @Body() data: EventsDto,
  ): Promise<MemberEvent> {
    return await this.eventsService.updateEvent(Number(eventId), data);
  }
}
