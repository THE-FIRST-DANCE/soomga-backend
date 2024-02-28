import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function Pagination() {
  return applyDecorators(
    ApiQuery({
      name: 'cursor',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
    }),
  );
}
