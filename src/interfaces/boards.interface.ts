import { Board } from '@prisma/client';
import { CreateBoardDto } from 'src/shared/boards/dto/create-board.dto';
import { UpdateBoardDto } from 'src/shared/boards/dto/update-board.dto';

export interface BoardsRepositoryInterface {
  create(createBoardDto: CreateBoardDto): Promise<Board>;

  findAll(): Promise<Board[]>;

  findOne(id: number): Promise<Board>;

  update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board>;

  remove(id: number): Promise<Board>;
}
