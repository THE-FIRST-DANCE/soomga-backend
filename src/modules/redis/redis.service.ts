import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  private async safeJsonParse<T>(value: string) {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      return value as T;
    }
  }

  private stringifyValue(value: any) {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  async get<T>(key: string) {
    const value = await this.redis.get(key);
    return value ? this.safeJsonParse<T>(value) : null;
  }

  async set(key: string, value: any, expire?: number) {
    const stringValue = this.stringifyValue(value);
    await this.redis.set(key, stringValue);
    if (expire) {
      await this.redis.expire(key, expire);
    }
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async incr(key: string, expire?: number) {
    await this.redis.incr(key);

    if (expire) {
      this.redis.expire(key, expire);
    }
  }

  async decr(key: string) {
    return this.redis.decr(key);
  }

  async exists(key: string) {
    return this.redis.exists(key);
  }

  async hset(key: string, field: string, value: any) {
    return this.redis.hSet(key, field, this.stringifyValue(value));
  }

  async hget<T>(key: string, field: string) {
    const value = await this.redis.hGet(key, field);
    return value ? this.safeJsonParse<T>(value) : null;
  }

  async hdel(key: string, ...fields: string[]) {
    return this.redis.hDel(key, fields);
  }

  async lpush(key: string, ...values: any[]) {
    const stringValues = values.map(this.stringifyValue);
    return this.redis.lPush(key, stringValues);
  }

  async rpush(key: string, ...values: any[]) {
    const stringValues = values.map(this.stringifyValue);
    return this.redis.rPush(key, stringValues);
  }

  async lrange<T>(key: string, start: number, stop: number) {
    const values = await this.redis.lRange(key, start, stop);
    return Promise.all(values.map(this.safeJsonParse));
  }

  async sadd(key: string, ...members: any[]) {
    const stringMembers = members.map(this.stringifyValue);
    return this.redis.sAdd(key, stringMembers);
  }

  async smembers<T>(key: string) {
    const members = await this.redis.sMembers(key);
    return Promise.all(members.map(this.safeJsonParse));
  }
}
