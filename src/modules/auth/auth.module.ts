import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MembersService } from '../members/members.service';
import { MembersModule } from '../members/members.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/shared/constants/global.constants';
import { JwtStrategy } from './auth.jwt.strategy';

@Module({
  imports: [
    MembersModule,
    PrismaModule,
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  providers: [AuthService, MembersService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
