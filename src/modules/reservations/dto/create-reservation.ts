import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: '회원이 예약한 가이드의 ID',
    example: 1,
  })
  @IsNumber()
  guideId: number;

  @ApiProperty({
    description: '예약한 서비스의 ID',
    example: 1,
  })
  @IsNumber()
  serviceId: number;

  @ApiProperty({
    description: '예약 시작일',
    type: Date,
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: '예약 종료일',
    type: Date,
  })
  @IsDateString()
  endDate: Date;
}
