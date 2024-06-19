import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthPayload } from 'src/interfaces/auth.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
