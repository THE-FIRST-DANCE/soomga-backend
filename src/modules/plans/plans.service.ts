import { Injectable } from '@nestjs/common';
import { PlansRepository } from './plans.repository';
import { PlanDistance } from 'src/interfaces/google.interface';
import {
  ExecuteActivityDto,
  PlanAddDto,
  PlanCommentDto,
} from './dto/plans.dto';

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

  // 플랜 user id로 가져오기
  async getPlanByUserId(userId: number) {
    return await this.plansRepository.getPlanByUserId(userId);
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
  savePlan(data: PlanAddDto) {
    return this.plansRepository.saveOrUpdateSchedule(data);
  }

  // 플랜 삭제
  deletePlan(planId: number) {
    return this.plansRepository.deletePlan(planId);
  }

  // 플랜 댓글 달기
  addComment(planCommentDto: PlanCommentDto) {
    return this.plansRepository.addComment(planCommentDto);
  }

  // 플랜 댓글 불러오기
  getComments(planId: number) {
    return this.plansRepository.getComments(planId);
  }

  // 플랜 댓글 삭제
  deleteComment(commentId: number) {
    return this.plansRepository.deleteComment(commentId);
  }

  // 플랜 id 와 일차로 일과 가져오기
  getPlanWithDaySchedules(planId: number, period: number) {
    return this.plansRepository.getPlanWithDaySchedules(planId, period);
  }

  // 플랜 실행
  executePlan(planId: number, memberId: number) {
    return this.plansRepository.executePlan(planId, memberId);
  }

  // 플랜 일과 실행
  executeActivity(data: ExecuteActivityDto) {
    return this.plansRepository.executedActivity(data);
  }
}
