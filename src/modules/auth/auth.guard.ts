import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MemberStatus, Role } from '@prisma/client';
import ErrorMessage from '../../shared/constants/error-messages.constants';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {}

@Injectable()
export class AuthDeletedGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (user.status !== MemberStatus.DELETED) {
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
    }

    return user;
  }
}

@Injectable()
export class AuthMemberGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (
      user.status === MemberStatus.DELETED ||
      user.status === MemberStatus.INACTIVE
    ) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_MEMBER);
    }
    return user;
  }
}
@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('refresh') {}

@Injectable()
export class AuthAdminGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(ErrorMessage.INCORRECT_ROLE);
    }

    if (
      user.status === MemberStatus.DELETED ||
      user.status === MemberStatus.INACTIVE
    ) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_MEMBER);
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

    if (
      user.status === MemberStatus.DELETED ||
      user.status === MemberStatus.INACTIVE
    ) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_MEMBER);
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

    if (
      user.status === MemberStatus.DELETED ||
      user.status === MemberStatus.INACTIVE
    ) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_MEMBER);
    }

    return user;
  }
}

@Injectable()
export class AuthGoogleGuard extends AuthGuard('google') {}

@Injectable()
export class AuthLineGuard extends AuthGuard('line') {}
