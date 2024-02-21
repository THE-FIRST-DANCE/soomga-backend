import { Injectable } from '@nestjs/common';
import { PlansRepository } from './plans.repository';
import { PlanDistance } from 'src/interfaces/google.interface';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  // 경로 계산
  async getAllDistance(data: PlanDistance) {
    if (data.transport === 'transit') {
      return await this.plansRepository.getAllDistance(data);
    }
    return await this.plansRepository.getCarDistance(data);
  }
}
