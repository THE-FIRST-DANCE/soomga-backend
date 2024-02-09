import { Config } from './config.interface';
import packageJson from '../../package.json';

export const GLOBAL_CONFIG: Config = {
  nest: {
    port: process.env.PORT || 3000,
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
  },
};
