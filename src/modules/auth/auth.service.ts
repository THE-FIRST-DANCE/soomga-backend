import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MembersService } from '../members/members.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { OAuthProfile } from '../../interfaces/auth.interface';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { OAuthSignUpDto } from './dto/oauth-sign-up.dto';
import { Member } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const member = await this.membersService.findMemberByEmail(signInDto.email);
    if (
      !member ||
      !(await AuthHelpers.verify(signInDto.password, member.password))
    ) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }
    return this.generateTokens(member);
  }

  async signUp(signUpDto: SignUpDto) {
    await this.membersService.checkValidEmail(signUpDto.email);
    const member = await this.membersService.create(signUpDto);
    return this.generateTokens(member);
  }

  async signInWithOAuth(profile: OAuthProfile) {
    let [member] = await this.membersService.findByProvider(
      profile.provider,
      profile.providerId,
    );
    if (!member) {
      const newMember: OAuthSignUpDto = {
        nickname: profile.nickname,
        avatar: profile.avatar,
        provider: profile.provider,
        providerId: profile.providerId,
        password: AuthHelpers.generateRandomPassword(),
      };
      member = await this.membersService.create(newMember);
    }
    return this.generateTokens(member);
  }

  private generateTokens(member: Member) {
    const payload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
      avatar: member.avatar,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { user: payload, accessToken, refreshToken };
  }
}
