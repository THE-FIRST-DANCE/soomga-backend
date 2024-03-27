import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateBoardDto } from 'src/shared/boards/dto/create-board.dto';

export class CreateTripDto extends OmitType(CreateBoardDto, ['type'] as const) {
  @ApiProperty()
  tags: string[];
}
