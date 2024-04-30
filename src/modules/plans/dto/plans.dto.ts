import { Place } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

interface PlanConfirmList {
  item: Place;
  stayTime: string;
  nextLat: number;
  nextLng: number;
  nextPlaceId: number;
  nextTime: string;
  nextPlaceName: string;
  description: string;
}

interface PlanConfirm {
  [period: number]: PlanConfirmList[];
}

export class PlanAddDto {
  @IsNumber()
  @IsOptional()
  planId: number;

  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @IsNumber()
  @IsNotEmpty()
  period: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  list: PlanConfirm;

  @IsNotEmpty()
  @IsString()
  transport: string;
}

export class PlanCommentDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
