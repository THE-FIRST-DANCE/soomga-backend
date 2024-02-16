import { ApiProperty } from '@nestjs/swagger';
import { SendAuthCodeDto } from './send-authcode.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterPhoneNumberDto extends SendAuthCodeDto {
  @ApiProperty({
    example: '12345678',
    description: '인증번호',
  })
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
