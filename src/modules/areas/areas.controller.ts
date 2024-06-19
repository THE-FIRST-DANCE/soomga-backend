import { Controller, Get } from '@nestjs/common';
import { AreasService } from './areas.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('지역 API')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  @ApiOperation({
    summary: '모든 지역 조회',
    description: '모든 지역의 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 모든 지역의 정보를 조회했습니다.',
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  getAll() {
    return this.areasService.getAll();
  }
}
