import { Board, BoardType } from '@prisma/client';
import { BoardsRepositoryInterface } from 'src/interfaces/boards.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from 'src/shared/boards/dto/create-board.dto';
import { UpdateBoardDto } from 'src/shared/boards/dto/update-board.dto';

@Injectable()
export class SOSRepository implements BoardsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  create(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
      data: { ...createBoardDto, type: BoardType.SOS },
    });
  }

  findAll(): Promise<Board[]> {
    return this.prisma.board.findMany({ where: { type: BoardType.SOS } });
  }

  findOne(id: number): Promise<Board> {
    return this.prisma.board.findUnique({ where: { id } });
  }

  update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    return this.prisma.board.update({ where: { id }, data: updateBoardDto });
  }

  remove(id: number): Promise<void> {
    this.prisma.board.delete({ where: { id } });
    return;
  }
}
