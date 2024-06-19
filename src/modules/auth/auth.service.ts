import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MembersService } from '../members/members.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import {
  AuthCodePayload,
  AuthPayload,
  OAuthProfile,
} from '../../interfaces/auth.interface';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { OAuthSignUpDto } from './dto/oauth-sign-up.dto';
import { Member } from '@prisma/client';
import { CoolsmsService } from '../coolsms/coolsms.service';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { AuthCodeChannel } from '../../interfaces/auth.interface';
import { randomUUID } from 'crypto';
import { RegisterPhoneNumberDto } from './dto/register-phone-number.dto';

const AUTH_CODE_MAX_ATTEMPTS = 5;
@Injectable()
export class AuthService {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  authCodeMaxAttempts: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly coolsmsService: CoolsmsService,
  ) {
    const securityConfig = this.configService.get('security');
    this.accessTokenExpiresIn = securityConfig.accessTokenExpiresIn;
    this.refreshTokenExpiresIn = securityConfig.refreshTokenExpiresIn;
    this.authCodeMaxAttempts = securityConfig.authCodeMaxAttempts;
  }

  async signIn(signInDto: SignInDto) {
    const member = await this.membersService.findByEmail(signInDto.email);
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
    const { passwordConfirm, ...rest } = signUpDto;
    const member = await this.membersService.create(rest);
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

  async sendPhoneAuthCode(memberId: number, phoneNumber: string) {
    const attempts = await this.authRepository.getAuthCodeSendAttempts(
      AuthCodeChannel.SMS,
      phoneNumber,
    );
    if (attempts >= AUTH_CODE_MAX_ATTEMPTS) {
      throw new UnauthorizedException(ErrorMessage.TOO_MANY_ATTEMPTS);
    }

    const authCode = AuthHelpers.generateAuthCode();

    const authCodePayload: AuthCodePayload = {
      key: phoneNumber,
      value: phoneNumber,
      sub: memberId,
      authCode,
    };
    await this.coolsmsService.sendAuthCode(phoneNumber, authCode);
    await this.authRepository.increaseAuthCodeSendAttempts(
      AuthCodeChannel.SMS,
      phoneNumber,
    );
    await this.authRepository.cacheAuthCode(
      AuthCodeChannel.SMS,
      authCodePayload,
    );

    return authCode;
  }

  async validateAuthCode(
    id: number,
    authCode: string,
    channel: AuthCodeChannel,
    phoneNumber: string,
  ) {
    const attempts = await this.authRepository.getAuthCodeValidateAttempts(
      channel,
      id,
    );
    if (attempts >= AUTH_CODE_MAX_ATTEMPTS) {
      throw new UnauthorizedException(ErrorMessage.TOO_MANY_ATTEMPTS);
    }
    await this.authRepository.increaseAuthCodeValidateAttempts(channel, id);

    const authCodeCache = await this.authRepository.getAuthCode(
      channel,
      phoneNumber,
    );
    if (
      !authCodeCache ||
      authCodeCache.sub !== id ||
      authCodeCache.authCode !== authCode
    ) {
      throw new UnauthorizedException(ErrorMessage.INVALID_AUTH_CODE);
    }
    await this.authRepository.resetAuthCode(channel, phoneNumber);
    await this.authRepository.resetAuthCodeValidateAttempts(channel, id);
  }

  async restoreAccessToken(member: Member) {
    const payload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
      avatar: member.avatar,
    };

    return this.jwtService.sign(payload);
  }

  private generateTokens(member: Member) {
    const payload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
      avatar: member.avatar,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshTokenExpiresIn,
    });
    return { user: payload, accessToken, refreshToken };
  }

  async registerPhoneNumber(
    id: number,
    registerPhoneNumberDto: RegisterPhoneNumberDto,
  ) {
    const { phoneNumber, authCode } = registerPhoneNumberDto;

    await this.checkPhoneNumberValid(phoneNumber);
    await this.validateAuthCode(id, authCode, AuthCodeChannel.SMS, phoneNumber);

    return this.authRepository.registerPhoneNumber(id, phoneNumber);
  }

  private async checkPhoneNumberValid(phoneNumber: string) {
    const isExist = await this.membersService.findByPhoneNumber(phoneNumber);
    if (isExist) {
      throw new BadRequestException(ErrorMessage.PHONE_NUMBER_ALREADY_EXISTS);
    }
  }
}
