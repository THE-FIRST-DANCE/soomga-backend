import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { OAuthProfile } from '../../interfaces/auth.interface';
import {
  AuthAdminGuard,
  AuthGoogleGuard,
  AuthGuideGuard,
  AuthJwtGuard,
  AuthJwtRefreshGuard,
  AuthLineGuard,
  AuthUserGuard,
} from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { BaseConfig, SecurityConfig } from '../../configs/config.interface';
import { Member } from '@prisma/client';
import { SendAuthCodeDto } from './dto/send-authcode.dto';

@ApiTags('사용자 인증 API')
@Controller('auth')
export class AuthController {
  base: BaseConfig;
  security: SecurityConfig;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.base = this.configService.get<BaseConfig>('base');
    this.security = this.configService.get<SecurityConfig>('security');
  }

  // 로그인
  @Post('signin')
  @HttpCode(200)
  @ApiOperation({
    summary: '로그인',
    description: '사용자 로그인을 처리합니다.',
  })
  async signIn(
    @Body() body: SignInDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(body);

    this.setCookies(res, accessToken, refreshToken);

    return res.json({
      message: '로그인 되었습니다.',
      accessToken,
      refreshToken,
      user,
    });
  }

  // 로그아웃
  @Post('signout')
  @HttpCode(200)
  @ApiOperation({
    summary: '로그아웃',
    description: '사용자 로그아웃을 처리합니다.',
  })
  async signOut(@Res() res: Response): Promise<Response> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({ message: '로그아웃 되었습니다.' });
  }

  // 회원가입
  @Post('signup')
  @HttpCode(201)
  @ApiOperation({
    summary: '회원가입',
    description: '새 사용자 등록을 처리합니다.',
  })
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signUp(body);

    this.setCookies(res, accessToken, refreshToken);

    return res.json({
      message: '회원가입 되었습니다.',
      accessToken,
      refreshToken,
      user,
    });
  }

  // jwt header 테스트
  @Get('test')
  @ApiBearerAuth()
  @UseGuards(AuthJwtGuard)
  @ApiOperation({
    summary: '테스트',
    description: '테스트용 API입니다.',
  })
  async test(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return res.json({ message: '사용자 인증 테스트 API입니다.' });
  }

  // admin jwt header 테스트
  @Get('admin/test')
  @ApiBearerAuth()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: '관리자 테스트',
    description: '관리자용 테스트 API입니다.',
  })
  async adminTest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return res.json({ message: '관리자 인증 테스트 API입니다.' });
  }

  // user jwt header 테스트
  @Get('user/test')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({
    summary: '사용자 테스트',
    description: '사용자용 테스트 API입니다.',
  })
  async userTest(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return res.json({ message: '사용자 인증 테스트 API입니다.' });
  }

  @Get('guide/test')
  @ApiBearerAuth()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({
    summary: '가이드 테스트',
    description: '가이드용 테스트 API입니다.',
  })
  async guideTest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return res.json({ message: '가이드 인증 테스트 API입니다.' });
  }

  @Post('auth-code')
  @UseGuards(AuthJwtGuard)
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

    await this.authService.sendAuthCode(id, phoneNumber);

    return res.json({ message: '인증코드가 발송되었습니다.' });
  }

  // google oauth 로그인
  @Get('google')
  @UseGuards(AuthGoogleGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('line')
  @UseGuards(AuthLineGuard)
  async lineLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGoogleGuard)
  async googleAuthRedirect(
    @Req() req: { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signInWithOAuth(req.user);

    this.setCookies(res, accessToken, refreshToken);

    return res.json({
      message: 'Google 로그인 되었습니다.',
      accessToken,
      refreshToken,
      user,
    });
  }

  @Get('line/callback')
  @UseGuards(AuthLineGuard)
  async lineAuthRedirect(
    @Req() req: { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signInWithOAuth(req.user);

    this.setCookies(res, accessToken, refreshToken);

    // return res.redirect('back');
    // TODO: 나중에 프론트엔드로 리다이렉트할 수 있도록 수정

    return res.json({
      message: 'Line 로그인 되었습니다.',
      accessToken,
      refreshToken,
      user,
    });
  }

  @UseGuards(AuthJwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: { user: Member }, @Res() res: Response) {
    const accessToken = await this.authService.restoreAccessToken(req.user);

    res.cookie('accessToken', accessToken, {
      maxAge: this.security.accessTokenExpiresIn,
    });

    res.json({ message: 'accessToken 재발급 완료' });
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      maxAge: this.security.accessTokenExpiresIn,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: this.security.refreshTokenExpiresIn,
    });
  }
}
