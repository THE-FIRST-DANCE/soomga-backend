import { ApiProperty } from '@nestjs/swagger';
import { MemberStatusDto } from './member-status.dto';

export enum DeleteType {
  SOFT = 'soft',
  HARD = 'hard',
}

export class DeleteMembersDto extends MemberStatusDto {
  @ApiProperty({
    description: '삭제 타입',
    enum: DeleteType,
    example: DeleteType.SOFT,
  })
  type: string;
}
