import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendAuthCodeDto {
  @ApiProperty({
    example: '010xxxxxxxx',
    description: '인증번호를 받을 휴대폰 번호',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
