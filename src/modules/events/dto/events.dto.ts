import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  description: string;

  @IsNumber()
  planId: number;
}
