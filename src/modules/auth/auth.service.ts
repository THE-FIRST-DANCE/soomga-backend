import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthPayload,
  AuthResponse,
  OAuthProfile,
} from '../../interfaces/auth.interface';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CreateMemberDto } from '../members/dto/create-member.dto';
import { MembersService } from '../members/members.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
  ) {}

  async handleOAuthLogin(profile: OAuthProfile): Promise<AuthResponse> {
    let member = await this.membersService.findMemberByEmail(profile.email);
    if (!member) {
      const newUser: CreateMemberDto = {
        email: profile.email,
        nickname: profile.nickname,
        birthdate: new Date(),
        avatar: profile.avatar,
        provider: profile.provider,
        password: await AuthHelpers.generateRandomPassword(),
      };
      member = await this.membersService.create(newUser);
    }

    const payload: AuthPayload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
    };

    // JWT 생성 및 반환 로직
    return this.generateToken(payload);
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const member = await this.membersService.findMemberByEmail(signInDto.email);
    if (!member) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const isMatch = await AuthHelpers.verify(
      signInDto.password,
      member.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const payload: AuthPayload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
    };

    return this.generateToken(payload);
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    await this.membersService.checkValidEmail(signUpDto.email);
    await this.membersService.checkValidNickname(signUpDto.nickname);

    const { passwordConfirm, ...createData } = signUpDto;
    const member = await this.membersService.create(createData);

    const payload: AuthPayload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
    };

    return this.generateToken(payload);
  }

  private generateToken(payload: AuthPayload): AuthResponse {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
