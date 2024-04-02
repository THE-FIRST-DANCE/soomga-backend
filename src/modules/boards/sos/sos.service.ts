import { Injectable } from '@nestjs/common';
import { SOSRepository } from './sos.repository';
import { UpdateSOSDto } from './dto/update-sos.dto';
import { CreateSOSDto } from './dto/create-sos.dto';
import { CommentDto } from './dto/comment.dto';
import { createPageResponse } from '../../../shared/pagination/pagination.utils';
import { BoardStatus } from '@prisma/client';

@Injectable()
export class SOSService {
  constructor(private readonly sosRepository: SOSRepository) {}
  async create(createSOSDto: CreateSOSDto) {
    return this.sosRepository.create(createSOSDto);
  }

  async findAll() {
    return this.sosRepository.findAll();
  }

  async findAllPagination(cursor: number, limit: number) {
    const board = await this.sosRepository.findAllPagination(cursor, limit);

    return createPageResponse(board, { cursor, limit }, board.length);
  }

  async findOne(id: number) {
    return this.sosRepository.findOne(id);
  }

  async update(id: number, updateSosDto: UpdateSOSDto) {
    return this.sosRepository.update(id, updateSosDto);
  }

  async processUpdate(id: number, process: BoardStatus) {
    return this.sosRepository.processUpdate(id, process);
  }

  remove(id: number) {
    return this.sosRepository.remove(id);
  }

  createComment(boardId: number, commentDto: CommentDto) {
    return this.sosRepository.createComment(boardId, commentDto);
  }

  removeComment(commentId: number) {
    return this.sosRepository.removeComment(commentId);
  }
}
