import { Body, Controller, Post } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanDistance } from 'src/interfaces/google.interface';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // 경로 계산
  @Post('distance')
  async getAllDistance(@Body() data: PlanDistance) {
    return await this.plansService.getAllDistance(data);
  }
}
