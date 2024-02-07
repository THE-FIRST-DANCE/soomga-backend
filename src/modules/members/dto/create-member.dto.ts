import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMemberDto implements Prisma.MemberCreateInput {
  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(2, { message: '닉네임은 2글자 이상이어야 합니다.' })
  @MaxLength(12, { message: '닉네임은 12글자 이하여야 합니다.' })
  nickname: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: '비밀번호는 8글자 이상이어야 합니다.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  birthdate?: string | Date;

  avatar?: string;
  provider?: $Enums.Provider;
  role?: $Enums.Role;
}
