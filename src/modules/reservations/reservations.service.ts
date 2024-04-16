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

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly servicesService: ServicesService,
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
  ) {
    await this.servicesService.validateOwnershipService(
      guideId,
      reserveServiceDto.serviceId,
    );

    return this.reservationsRepository.createReservation(
      guideId,
      reserveServiceDto,
    );
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

  async acceptReservation(memberId: number, reservationId: number) {
    await this.verifyMemberOwnReservation(memberId, reservationId);

    return this.reservationsRepository.updateStatusReservation(
      reservationId,
      ReservationStatus.ACCEPTED,
    );
  }

  async rejectReservation(memberId: number, reservationId: number) {
    await this.verifyMemberOwnReservation(memberId, reservationId);

    return this.reservationsRepository.updateStatusReservation(
      reservationId,
      ReservationStatus.REJECTED,
    );
  }

  async cancelReservation(guideId: number, reservationId: number) {
    await this.verifyGuideOwnReservation(guideId, reservationId);

    return this.reservationsRepository.updateStatusReservation(
      reservationId,
      ReservationStatus.CANCELED,
    );
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
