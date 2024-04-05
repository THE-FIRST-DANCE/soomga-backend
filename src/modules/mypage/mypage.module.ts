import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MyPageService } from './mypage.service';
import { MyPageRepository } from './mypage.repository';
import { MembersRepository } from '../members/members.repository';
import { MembersModule } from '../members/members.module';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { MyPageController } from './mypage.controller';
import { PlansModule } from '../plans/plans.module';
import { GuidesModule } from '../guides/guides.module';
import { GuidesRepository } from '../guides/guides.repository';

@Module({
  imports: [PrismaModule, MembersModule, AuthModule, PlansModule, GuidesModule],
  controllers: [MyPageController],
  providers: [
    PrismaService,
    MyPageService,
    MyPageRepository,
    MembersRepository,
    AuthRepository,
    GuidesRepository,
  ],
  exports: [MyPageService, MyPageRepository],
})
export class MypageModule {}
