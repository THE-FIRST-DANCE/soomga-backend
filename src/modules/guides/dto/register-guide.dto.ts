import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsOptional } from 'class-validator';

export class RegisterGuideDto {
  @ApiProperty({
    description: '활동할 지역의 ID 목록',
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: '활동할 지역을 선택해주세요.' })
  @IsInt({ each: true })
  areaIds: number[];

  @ApiProperty({
    description: '사용할 수 있는 언어의 ID 목록',
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: '사용할 수 있는 언어를 선택해주세요.' })
  @IsInt({ each: true })
  languageIds: number[];

  @ApiProperty({
    description: '언어 인증의 ID 목록',
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  languageCertificationIds: number[];
}
