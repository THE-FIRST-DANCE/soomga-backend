import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

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
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '서비스 가격',
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: '서비스 사진',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  photo?: string;
}
