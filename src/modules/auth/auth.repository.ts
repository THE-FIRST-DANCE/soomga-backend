import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { AuthCodePayload } from 'src/interfaces/auth.interface';

const AUTH_CODE_ATTEMPT_EXPIRATION = 86400; // 24 hours
const AUTH_CODE_EXPIRATION = 300; // 5 mins

@Injectable()
export class AuthRepository {
  constructor(private readonly redisService: RedisService) {}

  async getAuthCode(phoneNumber: string) {
    const authCodeKey = `authCode:${phoneNumber}`;
    return this.redisService.get<AuthCodePayload>(authCodeKey);
  }

  async cacheAuthCode(cachePayload: AuthCodePayload) {
    const { phoneNumber } = cachePayload;
    const authCodeKey = `authCode:${phoneNumber}`;
    await this.redisService.set(
      authCodeKey,
      cachePayload,
      AUTH_CODE_EXPIRATION,
    );
  }

  async resetAuthCode(phoneNumber: string) {
    const authCodeKey = `authCode:${phoneNumber}`;
    await this.redisService.del(authCodeKey);
  }

  async getAuthCodeSendAttempts(phoneNumber: string) {
    const attemptsKey = `sendAttempts:${phoneNumber}`;
    const attempts = (await this.redisService.get<number>(attemptsKey)) || 0;

    return attempts;
  }

  async increaseAuthCodeSendAttempts(phoneNumber: string) {
    const attemptsKey = `sendAttempts:${phoneNumber}`;
    await this.redisService.incr(attemptsKey, AUTH_CODE_ATTEMPT_EXPIRATION);
  }

  async resetAuthCodeSendAttempts(phoneNumber: string) {
    const attemptsKey = `sendAttempts:${phoneNumber}`;
    await this.redisService.set(attemptsKey, 0);
  }

  async getAuthCodeValidateAttempts(id: number) {
    const attemptsKey = `validateAttempts:${id}`;
    const attempts = (await this.redisService.get<number>(attemptsKey)) || 0;

    return attempts;
  }

  async increaseAuthCodeValidateAttempts(id: number) {
    const attemptsKey = `validateAttempts:${id}`;
    await this.redisService.incr(attemptsKey, AUTH_CODE_ATTEMPT_EXPIRATION);
  }

  async resetAuthCodeValidateAttempts(id: number) {
    const attemptsKey = `validateAttempts:${id}`;
    await this.redisService.set(attemptsKey, 0);
  }
}
