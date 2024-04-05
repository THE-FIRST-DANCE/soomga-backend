import { Controller, Get } from '@nestjs/common';
import { AreasService } from './areas.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('지역 API')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  @ApiOperation({
    summary: '모든 지역 조회',
    description: '모든 지역의 정보를 조회합니다.',
  })
  getAll() {
    return this.areasService.getAll();
  }
}
