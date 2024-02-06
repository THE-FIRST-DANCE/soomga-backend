import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthResponse, OAuthProfile } from '../../interfaces/auth.interface';
import {
  AuthAdminGuard,
  AuthGoogleGuard,
  AuthGuideGuard,
  AuthJwtGuard,
  AuthUserGuard,
} from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';

@ApiTags('사용자 인증 API')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // 로그인
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: '사용자 로그인을 처리합니다.',
  })
  async signIn(
    @Body() body: SignInDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken } = await this.authService.signIn(body);
    const securityConfig = this.configService.get<SecurityConfig>('security');

    res.cookie('accessToken', accessToken, {
      maxAge: securityConfig.accessTokenExpiresIn,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: securityConfig.refreshTokenExpiresIn,
    });

    return res.json({ message: '로그인 되었습니다.' });
  }

  // 로그아웃
  @Post('signout')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '회원가입',
    description: '새 사용자 등록을 처리합니다.',
  })
  async signUp(
    @Body() body: SignUpDto,
    @Res() res: Response,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.authService.signUp(body);
    const securityConfig = this.configService.get<SecurityConfig>('security');

    res.cookie('accessToken', accessToken, {
      maxAge: securityConfig.accessTokenExpiresIn,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: securityConfig.refreshTokenExpiresIn,
    });

    return this.authService.signUp(body);
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

  // guide jwt header 테스트
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

  // google oauth 로그인
  @Get('google')
  @UseGuards(AuthGoogleGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGoogleGuard)
  async googleAuthRedirect(
    @Req() req: { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.handleOAuthLogin(req.user);
    const securityConfig = this.configService.get<SecurityConfig>('security');

    res.cookie('accessToken', accessToken, {
      maxAge: securityConfig.accessTokenExpiresIn,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: securityConfig.refreshTokenExpiresIn,
    });

    return res.json({ message: 'Google 로그인 되었습니다.' });
  }
}
