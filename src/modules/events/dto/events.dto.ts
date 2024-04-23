import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EventsDto {
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  start: string;

  @IsNotEmpty()
  end: string;

  @IsBoolean()
  allDay: boolean;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  planId: number;
}
