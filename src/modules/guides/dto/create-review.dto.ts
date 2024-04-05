import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Score for communication', example: 5 })
  communicationScore: number;

  @ApiProperty({ description: 'Score for kindness', example: 5 })
  kindnessScore: number;

  @ApiProperty({ description: 'Score for location', example: 5 })
  locationScore: number;

  @ApiProperty({ description: 'Review content', example: 'Great place!' })
  content: string;
}
