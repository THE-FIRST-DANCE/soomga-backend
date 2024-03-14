import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanDistance } from 'src/interfaces/google.interface';
import { PlanAddDto } from './dto/plans.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // 플랜 가져오기
  @Get()
  async getPlan(@Query() param: { authorId: number }) {
    return await this.plansService.getPlan(param.authorId);
  }

  // 플랜 id로 가져오기
  @Get(':planId')
  async getPlanById(@Param('planId') planId: number) {
    return await this.plansService.getPlanById(Number(planId));
  }

  // 경로 계산
  @Post('distance')
  async getAllDistance(@Body() data: PlanDistance) {
    return await this.plansService.getAllDistance(data);
  }

  // 경로 수정
  @Post('route/edit')
  async editPlaceOrder(@Body() data: PlanDistance) {
    return await this.plansService.editPlaceOrder(data);
  }

  // 경로 저장
  @Post('save')
  async savePlan(@Body() data: PlanAddDto) {
    return await this.plansService.savePlan(data);
  }
}
