import { HttpException, HttpStatus } from '@nestjs/common';

export class IncorrectRoleException extends HttpException {
  constructor(objectOrError?: any) {
    super(
      objectOrError || 'You do not have the correct permissions.',
      HttpStatus.FORBIDDEN,
    );
  }
}
