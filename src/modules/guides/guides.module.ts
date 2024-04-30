import { Module } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { GuidesController } from './guides.controller';
import { GuidesRepository } from './guides.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [PrismaModule, MembersModule],
  controllers: [GuidesController],
  providers: [GuidesService, GuidesRepository],
  exports: [GuidesService],
})
export class GuidesModule {}
