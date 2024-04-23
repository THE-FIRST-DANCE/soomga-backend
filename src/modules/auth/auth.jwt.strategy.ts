import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthPayload } from '../../interfaces/auth.interface';
import { MembersService } from '../members/members.service';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';

const cookieExtractor = (req: Request) => {
  return req.cookies.accessToken;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly membersService: MembersService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        cookieExtractor,
      ]),
      ignoreExpiration: configService.get('NODE_ENV') !== 'production',
      secretOrKey: configService.get<SecurityConfig>('security').jwtSecret,
    });
  }

  async validate(payload: AuthPayload) {
    const member = await this.membersService.findOne(payload.sub);

    if (!member) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    return member;
  }
}
