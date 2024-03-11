import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Member } from '@prisma/client';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Member => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
