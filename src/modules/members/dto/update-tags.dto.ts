import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: '태그 ID 목록',
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds: number[];
}
