import { Injectable } from '@nestjs/common';
import { AreasRepository } from './areas.repository';

@Injectable()
export class AreasService {
  constructor(private readonly areasRepository: AreasRepository) {}

  getAll() {
    return this.areasRepository.getAll();
  }
}
