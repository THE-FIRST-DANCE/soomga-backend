import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MembersModule } from '../members/members.module';
import { GuidesModule } from '../guides/guides.module';
import { MembersRepository } from '../members/members.repository';
import { GuidesRepository } from '../guides/guides.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MembersModule, GuidesModule, PrismaModule],
  controllers: [AdminController],
  providers: [AdminService, MembersRepository, GuidesRepository],
})
export class AdminModule {}
