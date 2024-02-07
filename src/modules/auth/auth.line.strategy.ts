import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LineProfile, OAuthProfile } from 'src/interfaces/auth.interface';
import { Provider } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-line';

@Injectable()
export class LineStrategy extends PassportStrategy(Strategy, 'line') {
  constructor(private readonly configService: ConfigService) {
    super({
      channelID: configService.get<string>('LINE_CHANNEL_ID'),
      channelSecret: configService.get<string>('LINE_CHANNEL_SECRET'),
      callbackURL: 'http://localhost:3000/auth/line/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: LineProfile,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    try {
      const oauthProfile: OAuthProfile = {
        nickname: profile.displayName,
        avatar: profile.pictureUrl,
        provider: Provider.LINE,
        providerId: profile.id,
        accessToken,
      };

      done(null, oauthProfile);
    } catch (error) {
      done(error);
    }
  }
}
