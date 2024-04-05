import { Config } from './config.interface';
import packageJson from '../../package.json';
import * as process from 'process';

export const GLOBAL_CONFIG: Config = {
  nest: {
    port: process.env.APP_PORT || 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: process.env.NODE_ENV !== 'production',
    title: 'Soomga API',
    description: 'The Soomga API description',
    version: packageJson.version || '0.0.0',
    path: '/api/v1',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || '',
    port: +process.env.REDIS_PORT || 6379,
  },
  security: {
    accessTokenExpiresIn: 1000 * 60 * 60 * 0.5, // 0.5 hour
    refreshTokenExpiresIn: 1000 * 60 * 60 * 24 * 14, // 14 days
    bcryptSaltOrRound: 10,
    authCodeExpiration: 1000 * 60 * 5, // 5 mins,
    authCodeAttemptExpiration: 1000 * 60 * 60 * 24, // 24 hours
    authCodeMaxAttempts: 5,
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
  },
  base: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
    loadBalancerUrl:
      process.env.FRONTEND_URL.split(',').shift() || 'http://localhost:3000',
    mobileUrl: process.env.MOBILE_REDIRECT_URL || 'exp://192.168.0.20:8081',
  },
  cache: {
    ttl: +process.env.CACHE_TTL || 30_000,
    chat: {
      ttl: +process.env.CACHE_CHAT_TTL || 1000 * 60 * 60 * 24,
      maxNumOfMsgs: +process.env.CACHE_CHAT_MAX_NUM_OF_MSGS || 100,
    },
  },
  aws: {
    region: process.env.AWS_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
    s3AccessKey: process.env.AWS_S3_ACCESS_KEY,
    s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
};
