import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthGuideGuard, AuthMemberGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/auth.decorator';
import { Member } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation';
import { UpdateReservationDto } from './dto/update-reservation';
import { ReservationsService } from './reservations.service';

@ApiTags('예약 API')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('reservation')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '서비스 예약',
    description: '가이드의 서비스를 예약합니다.',
  })
  async reserveService(
    @User() user: Member,
    @Body() reserveServiceDto: CreateReservationDto,
  ) {
    const { id: guideId } = user;
    return this.reservationsService.reserveService(guideId, reserveServiceDto);
  }

  @Patch('reservation/:reservationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '예약 수정',
    description: '가이드의 예약을 수정합니다.',
  })
  async updateReservation(
    @User() user: Member,
    @Param('reservationId') reservationId: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const { id: guideId } = user;
    return this.reservationsService.updateReservation(
      guideId,
      reservationId,
      updateReservationDto,
    );
  }

  @Post('reservation/:reservationId/accept')
  @ApiBearerAuth()
  @UseGuards(AuthMemberGuard)
  @ApiOperation({
    summary: '예약 수락',
    description: '가이드의 예약을 수락합니다.',
  })
  async acceptReservation(
    @User() user: Member,
    @Param('reservationId') reservationId: string,
  ) {
    const { id: memberId } = user;
    return this.reservationsService.acceptReservation(memberId, +reservationId);
  }

  @Post('reservation/:reservationId/reject')
  @ApiBearerAuth()
  @UseGuards(AuthMemberGuard)
  @ApiOperation({
    summary: '예약 거절',
    description: '가이드의 예약을 거절합니다.',
  })
  async rejectReservation(
    @User() user: Member,
    @Param('reservationId') reservationId: string,
  ) {
    const { id: memberId } = user;
    return this.reservationsService.rejectReservation(memberId, +reservationId);
  }

  @Post('reservation/:reservationId/cancel')
  @ApiBearerAuth()
  @UseGuards(AuthMemberGuard)
  @ApiOperation({
    summary: '예약 취소',
    description: '가이드의 예약을 취소합니다.',
  })
  async cancelReservation(
    @User() user: Member,
    @Param('reservationId') reservationId: string,
  ) {
    const { id: memberId } = user;
    return this.reservationsService.cancelReservation(memberId, +reservationId);
  }
}
