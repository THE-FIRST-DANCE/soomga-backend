import { Board, BoardStatus, BoardType } from '@prisma/client';
import { BoardsRepositoryInterface } from 'src/interfaces/boards.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateBoardDto } from 'src/shared/boards/dto/update-board.dto';
import { CreateSOSDto } from './dto/create-sos.dto';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class SOSRepository implements BoardsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  create(createSOSDto: CreateSOSDto): Promise<Board> {
    return this.prisma.board.create({
      data: { ...createSOSDto, type: BoardType.SOS },
    });
  }

  findAll(): Promise<Board[]> {
    return this.prisma.board.findMany({ where: { type: BoardType.SOS } });
  }

  findAllPagination(cursor: number, limit: number = 10): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: { id: { lt: cursor }, type: BoardType.SOS },
      include: {
        comments: {
          include: { member: true },
        },
        author: true,
      },
      take: limit,
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number): Promise<Board> {
    return this.prisma.board.findUnique({ where: { id } });
  }

  update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    return this.prisma.board.update({ where: { id }, data: updateBoardDto });
  }

  processUpdate(id: number, process: BoardStatus) {
    return this.prisma.board.update({
      where: { id },
      data: {
        process,
      },
    });
  }

  remove(id: number) {
    return this.prisma.board.delete({ where: { id } });
  }

  createComment(boardId: number, commentDto: CommentDto) {
    return this.prisma.comment.create({
      data: {
        content: commentDto.content,
        member: { connect: { id: Number(commentDto.memberId) } },
        board: { connect: { id: Number(boardId) } },
      },
    });
  }

  removeComment(commentId: number) {
    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
