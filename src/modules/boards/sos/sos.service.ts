import { Injectable } from '@nestjs/common';
import { SOSRepository } from './sos.repository';
import { UpdateSOSDto } from './dto/update-sos.dto';
import { CreateSOSDto } from './dto/create-sos.dto';

@Injectable()
export class SOSService {
  constructor(private readonly sosRepository: SOSRepository) {}
  async create(createSosDto: CreateSOSDto) {
    return this.sosRepository.create(createSosDto);
  }

  async findAll() {
    return this.sosRepository.findAll();
  }

  async findOne(id: number) {
    return this.sosRepository.findOne(id);
  }

  async update(id: number, updateSosDto: UpdateSOSDto) {
    return this.sosRepository.update(id, updateSosDto);
  }

  async remove(id: number) {
    return this.sosRepository.remove(id);
  }
}
