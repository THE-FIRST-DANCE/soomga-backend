import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameDto {
  @ApiProperty({
    example: 'nickname',
    description: '닉네임',
    required: true,
  })
  nickname: string;
}
