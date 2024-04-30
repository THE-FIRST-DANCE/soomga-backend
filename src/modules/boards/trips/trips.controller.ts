import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AuthJwtGuard, AuthMemberGuard } from '../../auth/auth.guard';
import { Member } from '@prisma/client';
import { Response } from 'express';
import { Pagination } from '../../../shared/decorators/pagination.decorator';
import { ParseIntWithDefaultPipe } from '../../../shared/pagination/pagination.pipe';
import { ParseIntArrayPipe } from '../../../pipes/ParseIntArrayPipe.service';
import { CommentDto } from '../sos/dto/comment.dto';

@ApiTags('여행 게시판 API')
// @UseGuards(AuthJwtGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({
    summary: '여행 게시글 작성',
    description: '여행 게시글을 작성합니다.',
  })
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 여행 게시글 조회' })
  findAll() {
    return this.tripsService.findAll();
  }

  @Get('recommendation')
  @ApiOperation({ summary: '추천 여행 게시글 조회' })
  findRecommendation() {
    return this.tripsService.findRecommendation();
  }

  @Get('find')
  @ApiOperation({ summary: '조건 여행 게시물 무한 스크롤' })
  @Pagination()
  findPagination(
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
    @Query('areas', ParseIntArrayPipe) areas?: number[],
    @Query('sort', ParseIntWithDefaultPipe) sort?: string,
  ) {
    return this.tripsService.findPagination(cursor, limit, areas, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 여행 게시글 조회' })
  @ApiParam({ name: 'id', type: 'number', description: '조회할 게시글의 ID' })
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '여행 게시글 수정' })
  @ApiParam({ name: 'id', type: 'number', description: '수정할 게시글의 ID' })
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(+id, updateTripDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '여행 게시글 삭제' })
  @ApiParam({ name: 'id', type: 'number', description: '삭제할 게시글의 ID' })
  remove(@Param('id') id: string) {
    return this.tripsService.remove(+id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: '여행 게시글 좋아요 토글' })
  @ApiParam({ name: 'id', type: 'number', description: '좋아요할 게시글의 ID' })
  @UseGuards(AuthMemberGuard)
  async like(
    @Req() req: { user: Member },
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { user } = req;

    const result = await this.tripsService.like(+id, user.id);

    if (result) {
      return res.status(201).json({ message: '좋아요 되었습니다.' });
    } else {
      return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    }
  }

  @ApiOperation({ summary: '댓글 불러오기' })
  @Get(':boardId/comment')
  getComments(@Param('boardId', ParseIntWithDefaultPipe) boardId: number) {
    return this.tripsService.getComments(boardId);
  }

  @ApiOperation({ summary: '댓글 작성' })
  @Post(':boardId/comment')
  createComment(
    @Param('boardId', ParseIntWithDefaultPipe) boardId: number,
    @Body() commentDto: CommentDto,
  ) {
    return this.tripsService.comment(boardId, commentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete('comment/:commentId')
  removeComment(
    @Param('commentId', ParseIntWithDefaultPipe) commentId: number,
  ) {
    return this.tripsService.removeComment(commentId);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Patch('comment/:commentId')
  updateComment(
    @Param('commentId', ParseIntWithDefaultPipe) commentId: number,
    @Body() { content }: { content: string },
  ) {
    return this.tripsService.updateComment(commentId, content);
  }
}
