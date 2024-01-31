export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  redis: RedisConfig;
  security: SecurityConfig;
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
  expiresIn: number;
  bcryptSaltOrRound: string | number;
}
