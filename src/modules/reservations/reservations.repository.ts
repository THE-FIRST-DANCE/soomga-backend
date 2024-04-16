import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation';
import { UpdateReservationDto } from './dto/update-reservation';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findReservation(reservationId: number) {
    return this.prismaService.reservation.findUnique({
      where: { id: reservationId },
    });
  }

  createReservation(guideId: number, reserveServiceDto: CreateReservationDto) {
    return this.prismaService.reservation.create({
      data: {
        guideId,
        ...reserveServiceDto,
      },
    });
  }

  updateReservation(
    reservationId: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    return this.prismaService.reservation.update({
      where: { id: reservationId },
      data: updateReservationDto,
    });
  }

  updateStatusReservation(reservationId: number, status: ReservationStatus) {
    return this.prismaService.reservation.update({
      where: { id: reservationId },
      data: { status },
    });
  }
}
