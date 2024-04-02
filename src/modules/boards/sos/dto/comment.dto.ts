import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
