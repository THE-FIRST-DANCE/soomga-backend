import { PickType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation';

export class UpdateReservationDto extends PickType(CreateReservationDto, [
  'startDate',
  'endDate',
]) {}
