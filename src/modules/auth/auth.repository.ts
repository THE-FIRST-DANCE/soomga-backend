import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AuthCodePayload } from '../../interfaces/auth.interface';

const AUTH_CODE_ATTEMPT_EXPIRATION = 1_000 * 60 * 60 * 24; // 24 hours
const AUTH_CODE_EXPIRATION = 1_000 * 60 * 5; // 5 mins

@Injectable()
export class AuthRepository {
  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {}

  async getAuthCode(phoneNumber: string) {
    const authCodeKey = `authCode:${phoneNumber}`;

    return this.cacheManager.get<AuthCodePayload>(authCodeKey);
  }

  async cacheAuthCode(cachePayload: AuthCodePayload) {
    const { phoneNumber } = cachePayload;
    const authCodeKey = `authCode:${phoneNumber}`;
    this.cacheManager.set(authCodeKey, cachePayload, AUTH_CODE_EXPIRATION);
  }

  async resetAuthCode(phoneNumber: string) {
    const authCodeKey = `authCode:${phoneNumber}`;
    this.cacheManager.del(authCodeKey);
  }

  async getAuthCodeSendAttempts(phoneNumber: string) {
    const attemptsKey = `sendAttempts:${phoneNumber}`;
    const attempts = (await this.cacheManager.get<number>(attemptsKey)) || 0;
    return attempts;
  }

  async increaseAuthCodeSendAttempts(phoneNumber: string) {
    const attemptsKey = `sendAttempts:${phoneNumber}`;
    const currentValue =
      (await this.cacheManager.get<number>(attemptsKey)) || 0;
    this.cacheManager.set(
      attemptsKey,
      currentValue + 1,
      AUTH_CODE_ATTEMPT_EXPIRATION,
    );
  }

  async resetAuthCodeSendAttempts(phoneNumber: string) {
    const attemptsKey = `sendAttempts:${phoneNumber}`;
    this.cacheManager.del(attemptsKey);
  }

  async getAuthCodeValidateAttempts(id: number) {
    const attemptsKey = `validateAttempts:${id}`;
    const attempts = (await this.cacheManager.get<number>(attemptsKey)) || 0;
    return attempts;
  }

  async increaseAuthCodeValidateAttempts(id: number) {
    const attemptsKey = `validateAttempts:${id}`;
    const currentValue =
      (await this.cacheManager.get<number>(attemptsKey)) || 0;
    this.cacheManager.set(
      attemptsKey,
      currentValue + 1,
      AUTH_CODE_ATTEMPT_EXPIRATION,
    );
  }

  async resetAuthCodeValidateAttempts(id: number) {
    const attemptsKey = `validateAttempts:${id}`;
    this.cacheManager.del(attemptsKey);
  }
}
