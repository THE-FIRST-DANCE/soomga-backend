import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'password',
    description: '현재 비밀번호',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'newPassword',
    description: '새 비밀번호',
    required: true,
  })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8글자 이상이어야 합니다.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  newPassword: string;

  @ApiProperty({
    example: 'newPassword',
    description: '새 비밀번호 확인',
    required: true,
  })
  @IsString()
  @Match('newPassword')
  newPasswordConfirm: string;
}
