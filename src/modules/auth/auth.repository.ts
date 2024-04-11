import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  AuthCodeChannel,
  AuthCodePayload,
} from '../../interfaces/auth.interface';

import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  securityConfig: SecurityConfig;
  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.securityConfig = this.configService.get<SecurityConfig>('security');
  }

  async getAuthCode(channel: AuthCodeChannel, key: string) {
    const authCodeKey = `authCode:${channel}:${key}`;

    return this.cacheManager.get<AuthCodePayload>(authCodeKey);
  }

  async cacheAuthCode(channel: AuthCodeChannel, cachePayload: AuthCodePayload) {
    const { key } = cachePayload;
    const authCodeKey = `authCode:${channel}:${key}`;
    this.cacheManager.set(
      authCodeKey,
      cachePayload,
      this.securityConfig.authCodeExpiration,
    );
  }

  async resetAuthCode(channel: AuthCodeChannel, key: string) {
    const authCodeKey = `authCode:${channel}:${key}`;
    this.cacheManager.del(authCodeKey);
  }

  async getAuthCodeSendAttempts(channel: AuthCodeChannel, key: string) {
    const attemptsKey = `sendAttempts:${channel}:${key}`;
    const attempts = (await this.cacheManager.get<number>(attemptsKey)) || 0;
    return attempts;
  }

  async increaseAuthCodeSendAttempts(channel: AuthCodeChannel, key: string) {
    const attemptsKey = `sendAttempts:${channel}:${key}`;
    const currentValue =
      (await this.cacheManager.get<number>(attemptsKey)) || 0;
    this.cacheManager.set(
      attemptsKey,
      currentValue + 1,
      this.securityConfig.authCodeAttemptExpiration,
    );
  }

  async resetAuthCodeSendAttempts(channel: AuthCodeChannel, key: string) {
    const attemptsKey = `sendAttempts:${channel}:${key}`;
    this.cacheManager.del(attemptsKey);
  }

  async getAuthCodeValidateAttempts(channel: AuthCodeChannel, id: number) {
    const attemptsKey = `validateAttempts:${channel}:${id}`;
    const attempts = (await this.cacheManager.get<number>(attemptsKey)) || 0;
    return attempts;
  }

  async increaseAuthCodeValidateAttempts(channel: AuthCodeChannel, id: number) {
    const attemptsKey = `validateAttempts:${channel}:${id}`;
    const currentValue =
      (await this.cacheManager.get<number>(attemptsKey)) || 0;
    this.cacheManager.set(
      attemptsKey,
      currentValue + 1,
      this.securityConfig.authCodeAttemptExpiration,
    );
  }

  async resetAuthCodeValidateAttempts(channel: AuthCodeChannel, id: number) {
    const attemptsKey = `validateAttempts:${channel}:${id}`;
    this.cacheManager.del(attemptsKey);
  }

  async setEmailVerified(id: number) {
    return this.prismaService.member.update({
      where: { id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  async registerPhoneNumber(id: number, phoneNumber: string) {
    return this.prismaService.member.update({
      where: { id },
      data: { phoneNumber },
    });
  }
}
