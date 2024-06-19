import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanDistance } from 'src/interfaces/google.interface';
import {
  ExecuteActivityDto,
  PlanAddDto,
  PlanCommentDto,
  PlanExecuteDto,
} from './dto/plans.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import { ParseIntWithDefaultPipe } from '../../shared/pagination/pagination.pipe';

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

  // 플랜 user id로 가져오기
  @ApiOperation({
    summary: '플랜 user id로 조회',
    description: '플랜 user id로 플랜을 조회합니다.',
  })
  @Get('user/:userId')
  async getPlanByUserId(@Param('userId') userId: number) {
    return await this.plansService.getPlanByUserId(Number(userId));
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

  // 플랜 삭제
  @ApiOperation({
    summary: '플랜 삭제',
    description: '플랜을 삭제합니다.',
  })
  @Delete(':planId')
  deletePlan(@Param('planId', ParseIntWithDefaultPipe) planId: number) {
    return this.plansService.deletePlan(planId);
  }

  // 플랜 댓글 달기
  @ApiOperation({
    summary: '플랜 댓글 달기',
    description: '플랜에 댓글을 답니다.',
  })
  @Post('comment')
  addComment(@Body() planCommentDto: PlanCommentDto) {
    return this.plansService.addComment(planCommentDto);
  }

  // 댓글 불러오기
  @ApiOperation({
    summary: '댓글 불러오기',
    description: '플랜의 댓글을 불러옵니다.',
  })
  @Get(':planId/comments')
  getComments(@Param('planId', ParseIntWithDefaultPipe) planId: number) {
    return this.plansService.getComments(planId);
  }

  // 댓글 삭제
  @ApiOperation({
    summary: '댓글 삭제',
    description: '댓글을 삭제합니다.',
  })
  @Delete('comment/:commentId')
  deleteComment(
    @Param('commentId', ParseIntWithDefaultPipe) commentId: number,
  ) {
    return this.plansService.deleteComment(commentId);
  }

  // 플랜 id 와 일차로 일과 가져오기
  @ApiOperation({
    summary: '플랜 일과 가져오기',
    description: '플랜의 일과를 가져옵니다.',
  })
  @Get(':planId/:period')
  getPlanWithDaySchedules(
    @Param('planId', ParseIntWithDefaultPipe) planId: number,
    @Param('period', ParseIntWithDefaultPipe) period: number,
  ) {
    return this.plansService.getPlanWithDaySchedules(planId, period);
  }

  // 플랜 실행
  @ApiOperation({
    summary: '플랜 실행',
    description: '플랜을 실행합니다.',
  })
  @Post('execute')
  executePlan(
    @Body() { planId, memberId }: { planId: number; memberId: number },
  ) {
    return this.plansService.executePlan(planId, memberId);
  }

  // 플랜 일과 실행
  @ApiOperation({
    summary: '플랜 일과 실행',
    description: '플랜의 일과를 실행합니다.',
  })
  @Post('activity/execute')
  async executeActivity(@Body() data: ExecuteActivityDto) {
    return this.plansService.executeActivity(data);
  }
}
