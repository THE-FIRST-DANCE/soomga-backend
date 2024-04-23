import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation';
import { UpdateReservationDto } from './dto/update-reservation';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { ReservationStatus } from '@prisma/client';
import { ChatService } from '../chat/chat.service';
import { Message } from 'src/interfaces/chat.interface';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly servicesService: ServicesService,
    private readonly chatService: ChatService,
  ) {}

  async findReservation(reservationId: number) {
    const reservation =
      await this.reservationsRepository.findReservation(reservationId);

    if (!reservation)
      throw new NotFoundException(ErrorMessage.NOTFOUND_RESERVATION);

    return reservation;
  }

  async reserveService(
    guideId: number,
    reserveServiceDto: CreateReservationDto,
    options?: { roomId?: string },
  ) {
    await this.servicesService.validateOwnershipService(
      guideId,
      reserveServiceDto.serviceId,
    );

    const reservation = await this.reservationsRepository.createReservation(
      guideId,
      reserveServiceDto,
    );

    if (options?.roomId) {
      // roomId가 있으면 채팅방으로 예약정보 전달
      this.chatService.sendReservation(options.roomId, reservation);
    }
  }

  async updateReservation(
    guideId: number,
    reservationId: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    await this.verifyGuideOwnReservation(guideId, reservationId);

    return this.reservationsRepository.updateReservation(
      reservationId,
      updateReservationDto,
    );
  }

  async acceptReservation(
    memberId: number,
    reservationId: number,
    options?: { roomId?: string },
  ) {
    await this.verifyMemberOwnReservation(memberId, reservationId);

    const reservation =
      await this.reservationsRepository.updateStatusReservation(
        reservationId,
        ReservationStatus.ACCEPTED,
      );

    if (options?.roomId) {
      this.chatService.updateReservation(options.roomId, reservation);
      this.chatService.justSendReservation(options.roomId, reservation);
    }

    return reservation;
  }
  async rejectReservation(
    memberId: number,
    reservationId: number,
    options?: { roomId?: string },
  ) {
    await this.verifyMemberOwnReservation(memberId, reservationId);

    const reservation =
      await this.reservationsRepository.updateStatusReservation(
        reservationId,
        ReservationStatus.REJECTED,
      );

    if (options?.roomId) {
      this.chatService.updateReservation(options.roomId, reservation);
      this.chatService.justSendReservation(options.roomId, reservation);
    }

    return reservation;
  }

  async cancelReservation(
    guideId: number,
    reservationId: number,
    options?: { roomId?: string },
  ) {
    await this.verifyGuideOwnReservation(guideId, reservationId);

    const reservation =
      await this.reservationsRepository.updateStatusReservation(
        reservationId,
        ReservationStatus.CANCELED,
      );

    if (options?.roomId) {
      this.chatService.updateReservation(options.roomId, reservation);
      this.chatService.justSendReservation(options.roomId, reservation);
    }
  }

  private async verifyGuideOwnReservation(
    guideId: number,
    reservationId: number,
  ) {
    const reservation = await this.findReservation(reservationId);

    if (reservation.guideId !== guideId)
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
  }

  private async verifyMemberOwnReservation(
    memberId: number,
    reservationId: number,
  ) {
    const reservation = await this.findReservation(reservationId);

    if (reservation.memberId !== memberId)
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
  }
}
