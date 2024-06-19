import { Inject, Injectable } from '@nestjs/common';
import {
  AuthCodeChannel,
  AuthCodePayload,
  AuthPayload,
} from '../../interfaces/auth.interface';

import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';
import { PrismaService } from '../prisma/prisma.service';

import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class AuthRepository {
  securityConfig: SecurityConfig;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.securityConfig = this.configService.get<SecurityConfig>('security');
  }

  async getAuthCode(channel: AuthCodeChannel, key: string) {
    const authCodeKey = `authCode:${channel}:${key}`;
    const raw = await this.redis.get(authCodeKey);

    return raw ? (JSON.parse(raw) as AuthCodePayload) : null;
  }

  async cacheAuthCode(channel: AuthCodeChannel, cachePayload: AuthCodePayload) {
    const { key } = cachePayload;
    const authCodeKey = `authCode:${channel}:${key}`;

    this.redis.set(
      authCodeKey,
      JSON.stringify(cachePayload),
      'EX',
      this.securityConfig.authCodeExpiration,
    );
  }

  async resetAuthCode(channel: AuthCodeChannel, key: string) {
    const authCodeKey = `authCode:${channel}:${key}`;

    this.redis.del(authCodeKey);
  }

  async getAuthCodeSendAttempts(channel: AuthCodeChannel, key: string) {
    const attemptsKey = `sendAttempts:${channel}:${key}`;
    const raw = await this.redis.get(attemptsKey);

    return raw ? parseInt(raw, 10) : 0;
  }

  async increaseAuthCodeSendAttempts(channel: AuthCodeChannel, key: string) {
    const attemptsKey = `sendAttempts:${channel}:${key}`;

    this.redis.incr(attemptsKey);
    this.redis.expire(
      attemptsKey,
      this.securityConfig.authCodeAttemptExpiration,
    );
  }

  async resetAuthCodeSendAttempts(channel: AuthCodeChannel, key: string) {
    const attemptsKey = `sendAttempts:${channel}:${key}`;

    this.redis.del(attemptsKey);
  }

  async getAuthCodeValidateAttempts(channel: AuthCodeChannel, id: number) {
    const attemptsKey = `validateAttempts:${channel}:${id}`;
    const raw = await this.redis.get(attemptsKey);

    return raw ? parseInt(raw, 10) : 0;
  }

  async increaseAuthCodeValidateAttempts(channel: AuthCodeChannel, id: number) {
    const attemptsKey = `validateAttempts:${channel}:${id}`;

    this.redis.incr(attemptsKey);
    this.redis.expire(attemptsKey, this.securityConfig.authCodeExpiration);
  }

  async resetAuthCodeValidateAttempts(channel: AuthCodeChannel, id: number) {
    const attemptsKey = `validateAttempts:${channel}:${id}`;

    this.redis.del(attemptsKey);
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

  async activeMember(id: number) {
    const key = `active`;

    return this.redis.sadd(key, id);
  }

  async getActiveMembers() {
    const key = `active`;

    const memberIds = await this.redis.smembers(key);
    return memberIds;
  }

  async getActive(id: number) {
    const key = `active:*:${id}`;

    const keys = await this.redis.keys(key);

    if (!keys.length) {
      return null;
    }

    const timestamp = await this.redis.get(keys[0]);
    return new Date(+timestamp);
  }
}
