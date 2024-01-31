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
    version: packageJson.version,
    path: '/api/v1',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || '',
    port: +process.env.REDIS_PORT || 6379,
  },
  security: {
    expiresIn: 3600 * 24, // 24h
    bcryptSaltOrRound: 10,
  },
};
