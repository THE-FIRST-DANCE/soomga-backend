import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanDistance } from 'src/interfaces/google.interface';
import { PlanAddDto } from './dto/plans.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Plan } from '@prisma/client';

@ApiTags('플랜 API')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // 플랜 가져오기
  @ApiOperation({
    summary: '플랜 조회',
    description: '작성자의 플랜을 조회합니다.',
  })
  @Get()
  async getPlan(@Query() param: { authorId: number }) {
    return await this.plansService.getPlan(param.authorId);
  }

  // 플랜 id로 가져오기
  @ApiOperation({
    summary: '플랜 id로 조회',
    description: '플랜 id로 플랜을 조회합니다.',
  })
  @Get(':planId')
  async getPlanById(@Param('planId') planId: number): Promise<Plan> {
    return await this.plansService.getPlanById(Number(planId));
  }

  // 경로 계산
  @ApiOperation({
    summary: '경로 계산',
    description: '경로를 계산합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '경로 계산 성공',
  })
  @Post('distance')
  async getAllDistance(@Body() data: PlanDistance) {
    return await this.plansService.getAllDistance(data);
  }

  // 경로 수정
  @ApiOperation({
    summary: '경로 수정',
    description: '경로를 수정합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '경로 수정 성공',
  })
  @Post('route/edit')
  async editPlaceOrder(@Body() data: PlanDistance) {
    return await this.plansService.editPlaceOrder(data);
  }

  // 경로 저장
  @ApiOperation({
    summary: '경로 저장',
    description: '경로를 저장합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '경로 저장 성공',
  })
  @Post('save')
  async savePlan(@Body() data: PlanAddDto) {
    return await this.plansService.savePlan(data);
  }
}
