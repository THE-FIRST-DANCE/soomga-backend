import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  AuthAdminGuard,
  AuthGuideGuard,
  AuthUserGuard,
} from '../auth/auth.guard';
import { GuidesService } from './guides.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterGuideDto } from './dto/register-guide.dto';
import { Gender, Member } from '@prisma/client';
import { Response } from 'express';
import { UpdateAreasDto } from './dto/update-areas.dto';
import { UpdateLanguageCertificationsDto } from './dto/update-language-certifications.dto';
import { UpdateLanguagesDto } from './dto/update-languages.dto';
import { Pagination } from '../../shared/decorators/pagination.decorator';
import {
  ParseIntArrayPipe,
  ParseIntWithDefaultPipe,
  ParseRangePipe,
} from '../../shared/pagination/pagination.pipe';
import {
  GuideOrderBy,
  GuidePaginationOptions,
  GuideSort,
} from './guides.interface';
import { ParseGenderPipe } from './guides.pipe';
import { GuidePagination } from './guides.decorator';
import { User } from '../auth/auth.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('가이드 API')
@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Get()
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '가이드 목록 조회',
    description: '모든 가이드의 정보를 조회합니다.',
  })
  async findAll() {
    return this.guidesService.findAll();
  }

  @Get('/search')
  @ApiOperation({
    summary: '가이드 검색',
    description: '가이드를 query에 따라 검색합니다.',
  })
  @Pagination()
  @GuidePagination()
  async search(
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
    @Query('gender', ParseGenderPipe) gender?: Gender,
    @Query('age', ParseRangePipe) age?: { min: number; max: number },
    @Query('guideCount', ParseRangePipe)
    guideCount?: { min: number; max: number },
    @Query('temperature', ParseRangePipe)
    temperature?: { min: number; max: number },
    @Query('areas', ParseIntArrayPipe) areas?: number[],
    @Query('languages', ParseIntArrayPipe) languages?: number[],
    @Query('languageCertifications', ParseIntArrayPipe)
    languageCertifications?: number[],
    @Query('score', ParseIntArrayPipe) score?: number[],
    @Query('orderBy') orderBy?: GuideOrderBy,
    @Query('sort') sort?: GuideSort,
  ) {
    const options: GuidePaginationOptions = {
      gender,
      age,
      guideCount,
      temperature,
      areas,
      languages,
      languageCertifications,
      score,
      orderBy,
      sort,
    };

    return this.guidesService.paginate(cursor, limit, options);
  }

  @Get(':id')
  @ApiOperation({
    summary: '아이디로 가이드 조회',
    description: '특정 아이디를 가진 가이드의 정보를 조회합니다.',
  })
  async findOne(@Param('id') id: string) {
    return this.guidesService.findOne(+id);
  }

  @Get(':guideId/services')
  @ApiOperation({
    summary: '가이드 서비스 조회',
    description: '특정 가이드의 서비스를 조회합니다.',
  })
  async getServices(@Param('guideId') guideId: string) {
    return this.guidesService.getServices(+guideId);
  }

  @Get(':guideId/reviews')
  @ApiOperation({
    summary: '가이드 리뷰 조회',
    description: '특정 가이드의 리뷰를 조회합니다.',
  })
  @Pagination()
  async getReviews(
    @Param('guideId') guideId: string,
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {
    return this.guidesService.getReviews(+guideId, cursor, limit);
  }

  @Get(':guideId/reservations')
  @ApiOperation({
    summary: '가이드 예약 조회',
    description: '가이드의 예약를 조회합니다.',
  })
  async getReservations(@Param('guideId') guideId: string) {
    return this.guidesService.getReservations(+guideId);
  }

  @Post(':guideId/reviews')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({
    summary: '가이드 리뷰 작성',
    description: '특정 가이드에 리뷰를 작성합니다.',
  })
  async createReview(
    @Param('guideId') guideId: string,
    @User() user: Member,
    @Body() createReviewDto: CreateReviewDto,
    @Res() res: Response,
  ) {
    const { id: reviewerId } = user;

    await this.guidesService.createReview(
      +guideId,
      +reviewerId,
      createReviewDto,
    );

    return res.json({ message: '리뷰가 작성되었습니다.' });
  }

  @Patch('reviews/:reviewId')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({
    summary: '가이드 리뷰 수정',
    description: '특정 가이드의 리뷰를 수정합니다.',
  })
  async updateReview(
    @Param('reviewId') reviewId: string,
    @User() user: Member,
    @Body() updateReviewDto: UpdateReviewDto,
    @Res() res: Response,
  ) {
    const { id: reviewerId } = user;

    await this.guidesService.updateReview(
      +reviewId,
      +reviewerId,
      updateReviewDto,
    );

    return res.json({ message: '리뷰가 수정되었습니다.' });
  }

  @Delete('reviews/:reviewId')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({
    summary: '가이드 리뷰 삭제',
    description: '특정 가이드의 리뷰를 삭제합니다.',
  })
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @User() user: Member,
    @Res() res: Response,
  ) {
    const { id: reviewerId } = user;

    await this.guidesService.deleteReview(+reviewId, +reviewerId);

    return res.json({ message: '리뷰가 삭제되었습니다.' });
  }

  @Post('register')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({
    summary: '가이드 등록',
    description: '가이드로 등록합니다.',
  })
  async registerGuide(
    @User() user: Member,
    @Body() registerGuideDto: RegisterGuideDto,
    @Res() res: Response,
  ) {
    const { id } = user;
    await this.guidesService.registerGuide(+id, registerGuideDto);

    return res.json({ message: '가이드 등록이 완료되었습니다.' });
  }

  @Put('update/areas')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 활동지역 수정',
    description: '가이드의 활동지역 정보를 수정합니다.',
  })
  async updateAreas(
    @User() user: Member,
    @Body() { areaIds }: UpdateAreasDto,
    @Res() res: Response,
  ) {
    const { id } = user;
    await this.guidesService.updateAreas(id, areaIds);

    return res.json({ message: '가이드 활동지역 정보가 수정되었습니다.' });
  }

  @Put('update/languages')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 언어 수정',
    description: '가이드의 언어 정보를 수정합니다.',
  })
  async updateLanguage(
    @User() user: Member,
    @Body() { languageIds }: UpdateLanguagesDto,
    @Res() res: Response,
  ) {
    const { id } = user;
    await this.guidesService.updateLanguageCertifications(id, languageIds);

    return res.json({ message: '가이드 언어 정보가 수정되었습니다.' });
  }

  @Put('update/language-certifications')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 언어 자격증 수정',
    description: '가이드의 언어 자격증 정보를 수정합니다.',
  })
  async updateLanguageCertifications(
    @User() user: Member,
    @Body() { languageCertificationIds }: UpdateLanguageCertificationsDto,
    @Res() res: Response,
  ) {
    const { id } = user;
    await this.guidesService.updateLanguageCertifications(
      id,
      languageCertificationIds,
    );

    return res.json({ message: '가이드 언어 자격증 정보가 수정되었습니다.' });
  }

  @Patch('update')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 프로필 수정',
    description: '가이드의 프로필 정보를 수정합니다.',
  })
  async updateProfile(
    @User() user: Member,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() res: Response,
  ) {
    const { id } = user;
    await this.guidesService.updateProfile(id, updateProfileDto);

    return res.json({ message: '가이드 서비스 정보가 수정되었습니다.' });
  }

  @Post('leave')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 탈퇴',
    description: '가이드를 탈퇴합니다. 유저로 전환됩니다.',
  })
  async leaveGuide(@User() user: Member, @Res() res: Response) {
    const { id } = user;
    await this.guidesService.leaveGuide(id);

    return res.json({ message: '가이드 탈퇴가 완료되었습니다.' });
  }
}
