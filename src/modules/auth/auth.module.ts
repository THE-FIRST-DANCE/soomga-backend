import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MembersService } from '../members/members.service';
import { MembersModule } from '../members/members.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.jwt.strategy';
import { GoogleStrategy } from './auth.google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LineStrategy } from './auth.line.strategy';
import { CoolsmsModule } from '../coolsms/coolsms.module';
import { AuthRepository } from './auth.repository';
import { SecurityConfig } from '../../configs/config.interface';
import { JwtRefreshStrategy } from './auth.jwt-refresh.strategy';
import { GoogleMobileStrategy } from './auth.googleMobile.strategy';
import { LineMobileStrategy } from './auth.lineMobile.strategy';

@Module({
  imports: [
    MembersModule,
    PrismaModule,
    CoolsmsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            configService.get<SecurityConfig>('security').accessTokenExpiresIn,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    MembersService,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    GoogleMobileStrategy,
    LineStrategy,
    LineMobileStrategy,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
