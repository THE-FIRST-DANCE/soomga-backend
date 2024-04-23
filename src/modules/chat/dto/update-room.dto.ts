import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRoomDto {
  @ApiProperty()
  @IsString()
  name: string;
}
