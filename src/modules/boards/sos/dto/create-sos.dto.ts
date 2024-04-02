import { OmitType } from '@nestjs/swagger';
import { CreateBoardDto } from 'src/shared/boards/dto/create-board.dto';

export class CreateSOSDto extends OmitType(CreateBoardDto, [
  'type',
  'title',
] as const) {}