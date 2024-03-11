import {
  Body,
  Controller,
  Get,
  Param,
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterGuideDto } from './dto/register-guide.dto';
import { Gender, Member } from '@prisma/client';
import { Response } from 'express';
import { UpdateAreasDto } from './dto/update-areas.dto';
import { UpdateLanguageCertificationsDto } from './dto/update-language-certifications.dto';
import { UpdateLanguagesDto } from './dto/update-languages.dto';
import { RegisterPhoneNumberDto } from './dto/register-phone-number.dto';
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
import { UpdateServiceDto } from './dto/update-service.dto';
import { User } from '../auth/auth.decorator';

@ApiTags('가이드 API')
@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Get()
  @UseGuards(AuthAdminGuard)
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

  @Post('register')
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

  @Put('update/service')
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 서비스 수정',
    description: '가이드의 서비스 정보를 수정합니다.',
  })
  async updateService(
    @User() user: Member,
    @Body() { content }: UpdateServiceDto,
    @Res() res: Response,
  ) {
    const { id } = user;
    await this.guidesService.updateService(id, content);

    return res.json({ message: '가이드 서비스 정보가 수정되었습니다.' });
  }

  @Post('leave')
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

  @Post('register/phone-number')
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '휴대폰 번호 등록',
    description: '가이드의 휴대폰 번호를 등록합니다.',
  })
  async registerPhoneNumber(
    @User() user: Member,
    @Body() registerPhoneNumberDto: RegisterPhoneNumberDto,
    @Res() res: Response,
  ) {
    const { id } = user;
    const { phoneNumber, authCode } = registerPhoneNumberDto;
    await this.guidesService.registerPhoneNumber(id, phoneNumber, authCode);

    return res.json({ message: '휴대폰 번호가 등록되었습니다.' });
  }
}
