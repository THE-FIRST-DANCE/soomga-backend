import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripsRepository } from './trips.repository';
import { UpdateTripDto } from './dto/update-trip.dto';
import { createPageResponse } from '../../../shared/pagination/pagination.utils';
import { CommentDto } from '../sos/dto/comment.dto';

@Injectable()
export class TripsService {
  constructor(private readonly tripsRepository: TripsRepository) {}
  create(createTripDto: CreateTripDto) {
    return this.tripsRepository.create(createTripDto);
  }

  findAll() {
    return this.tripsRepository.findAll();
  }

  async findPagination(
    cursor?: number,
    limit?: number,
    areas?: number[],
    sort?: string,
  ) {
    const board = await this.tripsRepository.findPagination(
      cursor,
      limit,
      areas,
      sort,
    );

    return createPageResponse(board, { cursor, limit }, board.length);
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

  getComments(id: number) {
    return this.tripsRepository.getComments(id);
  }
  comment(id: number, commentDto: CommentDto) {
    return this.tripsRepository.comment(id, commentDto);
  }

  removeComment(commentId: number) {
    return this.tripsRepository.removeComment(commentId);
  }

  updateComment(commentId: number, content: string) {
    return this.tripsRepository.updateComment(commentId, content);
  }
}
