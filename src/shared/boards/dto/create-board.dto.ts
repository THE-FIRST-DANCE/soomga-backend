import { ApiProperty } from '@nestjs/swagger';
import { BoardType, Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto implements Prisma.BoardCreateInput {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ enum: BoardType, required: false })
  @IsEnum(BoardType)
  @IsOptional()
  type?: BoardType;
}
