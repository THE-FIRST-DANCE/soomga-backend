import { Injectable } from '@nestjs/common';
import { PlansRepository } from './plans.repository';
import { PlanDistance } from 'src/interfaces/google.interface';
import { PlanAddDto } from './dto/plans.dto';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  // 플랜 가져오기
  async getPlan(authorId: number) {
    return await this.plansRepository.getPlan(authorId);
  }

  // 플랜 id로 가져오기
  async getPlanById(planId: number) {
    return await this.plansRepository.getPlanById(planId);
  }

  // 경로 계산
  async getAllDistance(data: PlanDistance) {
    if (data.transport === 'transit') {
      return await this.plansRepository.getBusDistance(data);
    }
    return await this.plansRepository.getCarDistance(data);
  }

  // 경로 수정
  async editPlaceOrder(data: PlanDistance) {
    return await this.plansRepository.editPlaceOrder(data);
  }

  // 경로 저장
  async savePlan(data: PlanAddDto) {
    return await this.plansRepository.saveSchedule(data);
  }
}
