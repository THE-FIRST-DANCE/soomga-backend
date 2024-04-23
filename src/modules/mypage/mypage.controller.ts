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

@ApiTags('마이페이지 API')
@Controller('mypage')
export class MyPageController {
  constructor(private readonly myPageService: MyPageService) {}

  @Get()
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '마이페이지 정보 가져오기' })
  async mypage(@User() user: Member) {
    const { id } = user;
    return this.myPageService.findOne(id);
  }

  @Get('plans')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '나의 플랜 가져오기' })
  async myPlans(@User() user: Member) {
    const { id } = user;
    return this.myPageService.findPlans(id);
  }

  @Post('email')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '이메일 인증 코드 보내기' })
  async sendEmailAuthCode(
    @User() user: Member,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    const { id } = user;
  }

  @Patch('email')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '이메일 업데이트' })
  async updateEmail(
    @User() user: Member,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    const { id } = user;
    return this.myPageService.updateEmail(id, updateEmailDto);
  }

  @Patch('nickname')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '닉네임 업데이트' })
  async updateNickname(
    @User() user: Member,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ) {
    const { id } = user;
    return this.myPageService.updateNickname(id, updateNicknameDto);
  }

  @Patch('password')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({ summary: '비밀번호 업데이트' })
  async updatePassword(
    @User() user: Member,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const { id } = user;
    return this.myPageService.updatePassword(id, updatePasswordDto);
  }

  @Get('reviews/guide')
  @UseGuards(AuthMemberGuard)
  @Pagination()
  @ApiOperation({ summary: '내 가이드 리뷰 가져오기' })
  async getMyGuideReviews(
    @User() user: Member,
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {
    const { id } = user;
    return this.myPageService.getMyGuideReviews(id, cursor, limit);
  }

  @Get('follows')
  @UseGuards(AuthMemberGuard)
  @Pagination()
  @ApiOperation({ summary: '내 팔로우 가져오기' })
  async getMyFollows(
    @User() user: Member,
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {
    const { id } = user;
    return this.myPageService.getMyFollows(id, cursor, limit);
  }
}
