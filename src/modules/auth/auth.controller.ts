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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { OAuthProfile } from '../../interfaces/auth.interface';
import {
  AuthGoogleGuard,
  AuthJwtRefreshGuard,
  AuthLineGuard,
  AuthMemberGuard,
} from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { BaseConfig, SecurityConfig } from '../../configs/config.interface';
import { Member } from '@prisma/client';
import { SendAuthCodeDto } from './dto/send-authcode.dto';
import { User } from './auth.decorator';

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

  @Post('signup')
  @HttpCode(201)
  @ApiOperation({
    summary: '회원가입',
    description: '새 사용자 등록을 처리합니다.',
  })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signUp(signUpDto);

    this.setCookies(res, accessToken, refreshToken);

    return res.json({
      message: '회원가입 되었습니다.',
      accessToken,
      refreshToken,
      user,
    });
  }

  @Post('auth-code')
  @UseGuards(AuthMemberGuard)
  @ApiOperation({
    summary: '인증코드 발송',
    description: '가이드에게 인증코드를 발송합니다.',
  })
  async sendAuthCode(
    @User() user: Member,
    @Body() { phoneNumber }: SendAuthCodeDto,
    @Res() res: Response,
  ) {
    const { id } = user;

    await this.authService.sendAuthCode(id, phoneNumber);

    return res.json({ message: '인증코드가 발송되었습니다.' });
  }

  // google oauth 로그인
  @Get('google')
  @UseGuards(AuthGoogleGuard)
  async googleLogin() {}

  @Get('line')
  @UseGuards(AuthLineGuard)
  async lineLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGoogleGuard)
  async googleAuthRedirect(
    @Req() req: Request & { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signInWithOAuth(req.user);

    this.setCookies(res, accessToken, refreshToken);

    return res.redirect(`${this.base.frontendUrl}/redirect`);
  }

  @Get('line/callback')
  @UseGuards(AuthLineGuard)
  async lineAuthRedirect(
    @Req() req: Request & { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signInWithOAuth(req.user);

    this.setCookies(res, accessToken, refreshToken);

    return res.redirect(`${this.base.frontendUrl}/redirect`);
  }

  @UseGuards(AuthJwtRefreshGuard)
  @Post('refresh')
  async refresh(@User() user: Member, @Res() res: Response) {
    const accessToken = await this.authService.restoreAccessToken(user);

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
