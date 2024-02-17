import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthPayload } from 'src/interfaces/auth.interface';
import { MembersService } from '../members/members.service';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { ConfigService } from '@nestjs/config';
import { MemberStatus } from '@prisma/client';

const cookieExtractor = (req: Request) => {
  return req.cookies.accessToken;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly membersService: MembersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        cookieExtractor,
      ]),
      ignoreExpiration: process.env.NODE_ENV === 'dev',
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: AuthPayload) {
    const member = await this.membersService.findOne(payload.sub);

    if (!member) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    if (
      member.status === MemberStatus.DELETED ||
      member.status === MemberStatus.INACTIVE
    ) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_MEMBER);
    }

    return member;
  }
}
