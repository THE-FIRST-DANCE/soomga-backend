import Joi from 'joi';
import { Config } from 'src/configs/config.interface';
export const envValidateSchema: Joi.ObjectSchema<Config> = Joi.object({
  nest: Joi.object<Config['nest']>({
    port: Joi.number().required(),
    name: Joi.string().required(),
  }),
  cors: Joi.object<Config['cors']>({
    enabled: Joi.boolean().required(),
  }),
  swagger: Joi.object<Config['swagger']>({
    enabled: Joi.boolean().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    version: Joi.string().required(),
    path: Joi.string().required(),
  }),
  redis: Joi.object<Config['redis']>({
    host: Joi.string().required(),
    password: Joi.string().required(),
    port: Joi.number().required(),
  }),
  security: Joi.object<Config['security']>({
    accessTokenExpiresIn: Joi.number().required(),
    refreshTokenExpiresIn: Joi.number().required(),
    bcryptSaltOrRound: Joi.number().required(),
    authCodeExpiration: Joi.number().required(),
    authCodeAttemptExpiration: Joi.number().required(),
    authCodeMaxAttempts: Joi.number().required(),
    jwtSecret: Joi.string().required(),
    sessionSecret: Joi.string().required(),
  }),
  base: Joi.object<Config['base']>({
    frontendUrl: Joi.string().required(),
    backendUrl: Joi.string().required(),
    loadBalancerUrl: Joi.string().required(),
    mobileUrl: Joi.string().required(),
  }),
  cache: Joi.object<Config['cache']>({
    ttl: Joi.number().required(),
    chat: Joi.object({
      ttl: Joi.number().required(),
      maxNumOfMsgs: Joi.number().required(),
    }),
  }),
  aws: Joi.object<Config['aws']>({
    region: Joi.string().required(),
    s3Bucket: Joi.string().required(),
    s3AccessKey: Joi.string().required(),
    s3SecretAccessKey: Joi.string().required(),
  }),
});
