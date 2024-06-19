import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Get, Patch } from '@nestjs/common';
import { AuthMemberGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { User } from '../auth/auth.decorator';
import { Member } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { MyPageService } from './mypage.service';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { ParseIntWithDefaultPipe } from 'src/shared/pagination/pagination.pipe';
import { AuthPayload } from 'src/interfaces/auth.interface';

@ApiTags('마이페이지 API')
@Controller('mypage')
export class MyPageController {
  constructor(private readonly myPageService: MyPageService) {}

  @Get()
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '마이페이지 정보 가져오기' })
  async mypage(@User() { sub: id }: AuthPayload) {
    return this.myPageService.findOne(id);
  }

  @Get('plans')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '나의 플랜 가져오기' })
  async myPlans(@User() { sub: id }: AuthPayload) {
    return this.myPageService.findPlans(id);
  }

  @Post('email')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '이메일 인증 코드 보내기' })
  async sendEmailAuthCode(
    @User() { sub: id }: AuthPayload,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {}

  @Patch('email')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '이메일 업데이트' })
  async updateEmail(
    @User() { sub: id }: AuthPayload,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.myPageService.updateEmail(id, updateEmailDto);
  }

  @Patch('nickname')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '닉네임 업데이트' })
  async updateNickname(
    @User() { sub: id }: AuthPayload,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ) {
    return this.myPageService.updateNickname(id, updateNicknameDto);
  }

  @Patch('password')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '비밀번호 업데이트' })
  async updatePassword(
    @User() { sub: id }: AuthPayload,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.myPageService.updatePassword(id, updatePasswordDto);
  }

  @Get('reviews/guide')
  @UseGuards(AuthMemberGuard)
  @Pagination()
  @ApiOperation({ summary: '내 가이드 리뷰 가져오기' })
  async getMyGuideReviews(
    @User() { sub: id }: AuthPayload,
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {
    return this.myPageService.getMyGuideReviews(id, cursor, limit);
  }

  @Get('follows')
  @UseGuards(AuthMemberGuard)
  @Pagination()
  @ApiOperation({ summary: '내 팔로우 가져오기' })
  async getMyFollows(
    @User() { sub: id }: AuthPayload,
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {
    return this.myPageService.getMyFollows(id, cursor, limit);
  }
}
