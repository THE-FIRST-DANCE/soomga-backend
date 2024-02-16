import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuideGuard, AuthUserGuard } from '../auth/auth.guard';
import { GuidesService } from './guides.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterGuideDto } from './dto/register-guide.dto';
import { Member } from '@prisma/client';
import { Response } from 'express';
import { UpdateAreasDto } from './dto/update-areas.dto';
import { UpdateLanguageCertificationsDto } from './dto/update-language-certifications.dto';
import { UpdateLanguagesDto } from './dto/update-languages.dto';
import { SendAuthCodeDto } from './dto/send-authcode.dto';
import { RegisterPhoneNumberDto } from './dto/register-phone-number.dto';

@ApiTags('가이드 API')
@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

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
    @Req() req: { user: Member },
    @Body() registerGuideDto: RegisterGuideDto,
    @Res() res: Response,
  ) {
    const { id } = req.user;
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
    @Req() req: { user: Member },
    @Body() { areaIds }: UpdateAreasDto,
    @Res() res: Response,
  ) {
    const { id } = req.user;
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
    @Req() req: { user: Member },
    @Body() { languageIds }: UpdateLanguagesDto,
    @Res() res: Response,
  ) {
    const { id } = req.user;
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
    @Req() req: { user: Member },
    @Body() { languageCertificationIds }: UpdateLanguageCertificationsDto,
    @Res() res: Response,
  ) {
    const { id } = req.user;
    await this.guidesService.updateLanguageCertifications(
      id,
      languageCertificationIds,
    );

    return res.json({ message: '가이드 언어 자격증 정보가 수정되었습니다.' });
  }

  @Post('leave')
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 탈퇴',
    description: '가이드를 탈퇴합니다. 유저로 전환됩니다.',
  })
  async leaveGuide(@Req() req: { user: Member }, @Res() res: Response) {
    const { id } = req.user;
    await this.guidesService.leaveGuide(id);

    return res.json({ message: '가이드 탈퇴가 완료되었습니다.' });
  }

  @Post('auth-code')
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '인증코드 발송',
    description: '가이드에게 인증코드를 발송합니다.',
  })
  async sendAuthCode(
    @Req() req: { user: Member },
    @Body() { phoneNumber }: SendAuthCodeDto,
    @Res() res: Response,
  ) {
    const { id } = req.user;

    await this.guidesService.sendAuthCode(id, phoneNumber);

    return res.json({ message: '인증코드가 발송되었습니다.' });
  }

  // 휴대폰 번호 등록
  @Post('register/phone-number')
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '휴대폰 번호 등록',
    description: '가이드의 휴대폰 번호를 등록합니다.',
  })
  async registerPhoneNumber(
    @Req() req: { user: Member },
    @Body() registerPhoneNumberDto: RegisterPhoneNumberDto,
    @Res() res: Response,
  ) {
    const { id } = req.user;
    const { phoneNumber, authCode } = registerPhoneNumberDto;
    await this.guidesService.registerPhoneNumber(id, phoneNumber, authCode);

    return res.json({ message: '휴대폰 번호가 등록되었습니다.' });
  }
}
