import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: '서비스 내용',
    example: '<span>서비스 내용을 입력해주세요.</span>',
  })
  @IsString()
  @IsOptional()
  service: string;
}
