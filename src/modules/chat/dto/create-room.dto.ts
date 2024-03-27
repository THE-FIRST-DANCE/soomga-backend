import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    type: [Number],
    description: '참여자 ID 리스트',
  })
  participants: number[];
}
