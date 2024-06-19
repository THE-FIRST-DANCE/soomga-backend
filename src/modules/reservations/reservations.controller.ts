import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import {
  AuthGuideGuard,
  AuthMemberGuard,
  AuthUserGuard,
} from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/auth.decorator';
import { Member } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation';
import { UpdateReservationDto } from './dto/update-reservation';
import { ReservationsService } from './reservations.service';
import { AuthPayload } from 'src/interfaces/auth.interface';

@ApiTags('예약 API')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({
    summary: '서비스 예약',
    description: '가이드의 서비스를 예약합니다.',
  })
  async reserveService(
    @User() { sub: memberId }: AuthPayload,
    @Body() reserveServiceDto: CreateReservationDto,
    @Query('roomId') roomId?: string,
  ) {
    const options = {
      roomId,
    };

    return this.reservationsService.reserveService(
      memberId,
      reserveServiceDto,
      options,
    );
  }

  @Patch(':reservationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '예약 수정',
    description: '가이드의 예약을 수정합니다.',
  })
  async updateReservation(
    @User() { sub: guideId }: AuthPayload,
    @Param('reservationId') reservationId: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateReservation(
      guideId,
      reservationId,
      updateReservationDto,
    );
  }

  @Patch(':reservationId/accept')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '예약 수락',
    description: '가이드의 예약을 수락합니다.',
  })
  async acceptReservation(
    @User() { sub: memberId }: AuthPayload,
    @Param('reservationId') reservationId: string,
    @Query('roomId') roomId?: string,
  ) {
    return this.reservationsService.acceptReservation(
      memberId,
      +reservationId,
      { roomId },
    );
  }

  @Patch(':reservationId/reject')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({
    summary: '예약 거절',
    description: '가이드의 예약을 거절합니다.',
  })
  async rejectReservation(
    @User() { sub: memberId }: AuthPayload,
    @Param('reservationId') reservationId: string,
    @Query('roomId') roomId?: string,
  ) {
    return this.reservationsService.rejectReservation(
      memberId,
      +reservationId,
      { roomId },
    );
  }

  @Patch(':reservationId/cancel')
  @ApiBearerAuth()
  @UseGuards(AuthMemberGuard)
  @ApiOperation({
    summary: '예약 취소',
    description: '가이드의 예약을 취소합니다.',
  })
  async cancelReservation(
    @User() { sub: memberId }: AuthPayload,
    @Param('reservationId') reservationId: string,
  ) {
    return this.reservationsService.cancelReservation(memberId, +reservationId);
  }
}
