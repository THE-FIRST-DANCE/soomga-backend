import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { IncorrectRoleException } from 'src/exceptions/member.exception';
import ErrorMessage from 'src/shared/constants/error-messages.constants';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {}

@Injectable()
export class AuthAdminGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role !== Role.ADMIN) {
      throw new IncorrectRoleException(ErrorMessage.INCORRECT_ROLE);
    }
    return user;
  }
}

@Injectable()
export class AuthUserGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role !== Role.USER && user.role !== Role.ADMIN) {
      throw new IncorrectRoleException(ErrorMessage.INCORRECT_ROLE);
    }
    return user;
  }
}

@Injectable()
export class AuthGuideGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role !== Role.GUIDE && user.role !== Role.ADMIN) {
      throw new IncorrectRoleException(ErrorMessage.INCORRECT_ROLE);
    }
    return user;
  }
}

@Injectable()
export class AuthGoogleGuard extends AuthGuard('google') {}
