import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}
  async findAll() {
    return this.tagsRepository.findAll();
  }
}
