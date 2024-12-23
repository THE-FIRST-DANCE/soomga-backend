import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TrackingId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['tracking-id'];
  },
);
