import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: '서비스 이름',
    example: '서비스 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '서비스 설명',
    example: '서비스 설명',
  })
  @IsString()
  description?: string;
}
