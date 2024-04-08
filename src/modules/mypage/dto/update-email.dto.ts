import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({
    example: 'test@test.com',
    description: '이메일',
    required: true,
  })
  @IsString()
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    example: '1a2b3c4f',
    description: '인증코드',
    required: true,
  })
  @IsString()
  code: string;
}
