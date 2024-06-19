import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { SOSService } from './sos.service';
import { CreateSOSDto } from './dto/create-sos.dto';
import { UpdateSOSDto } from './dto/update-sos.dto';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { ParseIntWithDefaultPipe } from 'src/shared/pagination/pagination.pipe';
import { CommentDto } from './dto/comment.dto';

@ApiTags('SOS 게시판 API')
@Controller('sos')
export class SOSController {
  constructor(private readonly sosService: SOSService) {}

  @ApiOperation({
    summary: '새 SOS 생성',
    description: '새로운 SOS를 생성합니다.',
  })
  @ApiCreatedResponse({ description: 'SOS가 성공적으로 생성되었습니다.' })
  @Post()
  create(@Body() createSosDto: CreateSOSDto) {
    return this.sosService.create(createSosDto);
  }

  @ApiOperation({
    summary: '모든 SOS 가져오기',
    description: '모든 SOS를 조회합니다.',
  })
  @ApiOkResponse({ description: '모든 SOS 조회에 성공했습니다.' })
  @Get()
  findAll() {
    return this.sosService.findAll();
  }

  @ApiOperation({
    summary: '페이지네이션과 함께 모든 SOS 가져오기',
    description: '페이지네이션을 적용하여 모든 SOS를 조회합니다.',
  })
  @ApiOkResponse({
    description: '페이지네이션을 적용한 SOS 조회에 성공했습니다.',
  })
  @Get('all')
  @Pagination()
  findAllPagination(
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {
    return this.sosService.findAllPagination(cursor, limit);
  }

  @ApiOperation({
    summary: 'ID로 특정 SOS 가져오기',
    description: '주어진 ID에 해당하는 SOS를 조회합니다.',
  })
  @ApiOkResponse({ description: '특정 SOS 조회에 성공했습니다.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sosService.findOne(+id);
  }

  @ApiOperation({
    summary: 'ID로 특정 SOS 업데이트',
    description: '주어진 ID에 해당하는 SOS를 업데이트합니다.',
  })
  @ApiOkResponse({ description: '특정 SOS 업데이트에 성공했습니다.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSosDto: UpdateSOSDto) {
    return this.sosService.update(+id, updateSosDto);
  }

  @ApiOperation({
    summary: 'ID로 특정 SOS 삭제',
    description: '주어진 ID에 해당하는 SOS를 삭제합니다.',
  })
  @ApiOkResponse({ description: '특정 SOS 삭제에 성공했습니다.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sosService.remove(+id);
  }

  @ApiOperation({
    summary: '댓글 작성',
    description: '특정 SOS에 댓글을 작성합니다.',
  })
  @ApiCreatedResponse({ description: '댓글이 성공적으로 작성되었습니다.' })
  @Post(':boardId/comment')
  createComment(
    @Param('boardId') boardId: number,
    @Body() commentDto: CommentDto,
  ) {
    return this.sosService.createComment(boardId, commentDto);
  }

  @ApiOperation({
    summary: '댓글 삭제',
    description: '특정 댓글을 삭제합니다.',
  })
  @ApiOkResponse({ description: '댓글 삭제에 성공했습니다.' })
  @Delete('comment/:commentId')
  removeComment(
    @Param('commentId', ParseIntWithDefaultPipe) commentId: number,
  ) {
    return this.sosService.removeComment(commentId);
  }
}
