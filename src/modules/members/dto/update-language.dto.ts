import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class UpdateLanguageDto {
  @ApiProperty({
    description: '사용할 수 있는 언어의 ID 목록',
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  languageIds: number[];
}
