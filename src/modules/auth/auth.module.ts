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

@Module({
  imports: [
    MembersModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [AuthService, MembersService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
