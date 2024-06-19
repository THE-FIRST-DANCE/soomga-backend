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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthPayload, OAuthProfile } from '../../interfaces/auth.interface';
import {
  AuthGoogleGuard,
  AuthGoogleMobileGuard,
  AuthJwtRefreshGuard,
  AuthLineGuard,
  AuthLineMobileGuard,
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
import { RegisterPhoneNumberDto } from './dto/register-phone-number.dto';

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
  @ApiOperation({
    summary: '로그인',
    description: '사용자 로그인을 처리합니다.',
  })
  @ApiOkResponse({ description: '로그인 성공' })
  async signIn(
    @Body() body: SignInDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(body);

    this.setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: '로그인 되었습니다.',
      accessToken,
      refreshToken,
      user,
    });
  }

  @Post('signout')
  @ApiOperation({
    summary: '로그아웃',
    description: '사용자 로그아웃을 처리합니다.',
  })
  @ApiOkResponse({ description: '로그아웃 성공' })
  async signOut(@Res() res: Response): Promise<Response> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: '로그아웃 되었습니다.' });
  }

  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description: '새 사용자 등록을 처리합니다.',
  })
  @ApiCreatedResponse({ description: '회원가입 성공' })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signUp(signUpDto);

    this.setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: '회원가입 되었습니다.',
      accessToken,
      refreshToken,
      user,
    });
  }

  @Post('auth-code/phone')
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '휴대폰 인증코드 발송',
    description: '사용자에게 인증코드를 발송합니다.',
  })
  @ApiOkResponse({ description: '인증코드 발송 성공' })
  async sendAuthCode(
    @User() { sub: id }: AuthPayload,
    @Body() { phoneNumber }: SendAuthCodeDto,
    @Res() res: Response,
  ) {
    await this.authService.sendPhoneAuthCode(id, phoneNumber);

    return res.status(200).json({ message: '인증코드가 발송되었습니다.' });
  }

  // google oauth 로그인
  @Get('google')
  @UseGuards(AuthGoogleGuard)
  async googleLogin() {}

  @Get('google/mobile')
  @UseGuards(AuthGoogleMobileGuard)
  async googleMobileLogin() {}

  @Get('line')
  @UseGuards(AuthLineGuard)
  async lineLogin() {}

  @Get('line/mobile')
  @UseGuards(AuthLineMobileGuard)
  async lineMobileLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGoogleGuard)
  async googleAuthRedirect(
    @Req() req: Request & { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signInWithOAuth(req.user);

    this.setCookies(res, accessToken, refreshToken);

    return res.redirect(`${this.base.loadBalancerUrl}/redirect`);
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

    return res.redirect(`${this.base.loadBalancerUrl}/redirect`);
  }

  @Get('google/mobile/callback')
  @UseGuards(AuthGoogleMobileGuard)
  async googleMobileAuthRedirect(
    @Req() req: Request & { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signInWithOAuth(req.user);

    return res.redirect(
      `${this.base.mobileUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Get('line/mobile/callback')
  @UseGuards(AuthLineMobileGuard)
  async lineMobileAuthRedirect(
    @Req() req: Request & { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signInWithOAuth(req.user);

    return res.redirect(
      `${this.base.mobileUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @UseGuards(AuthJwtRefreshGuard)
  @Post('refresh')
  @ApiOkResponse({ description: 'accessToken 재발급 성공' })
  async refresh(@User() user: Member, @Res() res: Response) {
    const accessToken = await this.authService.restoreAccessToken(user);

    res.cookie('accessToken', accessToken, {
      maxAge: this.security.accessTokenExpiresIn,
    });

    return res.status(200).json({ message: 'accessToken 재발급 완료' });
  }

  @Post('register/phone-number')
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '휴대폰 번호 등록',
    description: '휴대폰 번호를 등록합니다.',
  })
  @ApiCreatedResponse({ description: '휴대폰 번호 등록 성공' })
  async registerPhoneNumber(
    @User() { sub: id }: AuthPayload,
    @Body() registerPhoneNumberDto: RegisterPhoneNumberDto,
    @Res() res: Response,
  ) {
    await this.authService.registerPhoneNumber(id, registerPhoneNumberDto);

    return res.status(201).json({ message: '휴대폰 번호가 등록되었습니다.' });
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
