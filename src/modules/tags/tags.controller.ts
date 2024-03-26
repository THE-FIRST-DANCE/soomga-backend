import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('태그 API')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({
    summary: '태그 목록 조회',
    description: '모든 태그의 정보를 조회합니다.',
  })
  async findAll() {
    return this.tagsService.findAll();
  }
}
