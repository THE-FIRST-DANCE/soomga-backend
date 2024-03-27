import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripsRepository } from './trips.repository';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly tripsRepository: TripsRepository) {}
  create(createTripDto: CreateTripDto) {
    return this.tripsRepository.create(createTripDto);
  }

  findAll() {
    return this.tripsRepository.findAll();
  }

  findOne(id: number) {
    return this.tripsRepository.findOne(id);
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return this.tripsRepository.update(id, updateTripDto);
  }

  remove(id: number) {
    return this.tripsRepository.remove(id);
  }

  like(id: number, userId: number) {
    return this.tripsRepository.like(id, userId);
  }
}
