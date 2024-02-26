import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import ErrorMessage from '../../shared/constants/error-messages.constants';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {}

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwt') {}

@Injectable()
export class AuthAdminGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(ErrorMessage.INCORRECT_ROLE);
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
      throw new ForbiddenException(ErrorMessage.INCORRECT_ROLE);
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
      throw new ForbiddenException(ErrorMessage.INCORRECT_ROLE);
    }
    return user;
  }
}

@Injectable()
export class AuthGoogleGuard extends AuthGuard('google') {}

@Injectable()
export class AuthLineGuard extends AuthGuard('line') {}
