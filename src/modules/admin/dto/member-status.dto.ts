import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class MemberStatusDto {
  @ApiProperty({
    description: '아이디 목록',
    isArray: true,
    example: [6],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
