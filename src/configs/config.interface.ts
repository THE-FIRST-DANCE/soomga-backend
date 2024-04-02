export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  redis: RedisConfig;
  security: SecurityConfig;
  base: BaseConfig;
  cache: CacheConfig;
  aws: AwsConfig;
}

export interface NestConfig {
  port: number | string;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  bcryptSaltOrRound: string | number;
  authCodeExpiration: number;
  authCodeAttemptExpiration: number;
  authCodeMaxAttempts: number;
  jwtSecret: string;
  sessionSecret: string;
}

export interface BaseConfig {
  frontendUrl: string;
  backendUrl: string;
  loadBalancerUrl: string;
}

export interface CacheConfig {
  ttl: number;
  chat: {
    ttl: number;
    maxNumOfMsgs: number;
  };
}

export interface AwsConfig {
  region: string;
  s3Bucket: string;
  s3AccessKey: string;
  s3SecretAccessKey: string;
}
