import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { MembersService } from '../members/members.service';
import { GoogleProfile, OAuthProfile } from 'src/interfaces/auth.interface';
import { Provider } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly membersService: MembersService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/callback', // Google에 등록한 리다이렉션 URI
      scope: ['email', 'profile'], // Google로부터 요청할 정보
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, name, photos } = profile;
    const oauthProfile: OAuthProfile = {
      email: emails[0].value,
      nickname: name.givenName + name.familyName,
      avatar: photos[0].value,
      provider: Provider.GOOGLE,
      accessToken,
    };

    done(null, oauthProfile);
  }
}
