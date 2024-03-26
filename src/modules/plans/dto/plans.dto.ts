import { Place } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

interface PlanConfirmList {
  item: Place;
  stayTime: string;
  nextLat: number;
  nextLng: number;
  nextPlaceId: number;
  nextTime: string;
  nextPlaceName: string;
}

interface PlanConfirm {
  [period: number]: PlanConfirmList[];
}

export class PlanAddDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;
  period: number;
  title: string;
  region: string;
  list: PlanConfirm;
  transport: string;
}
