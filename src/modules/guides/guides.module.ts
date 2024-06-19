import { Module } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { GuidesController } from './guides.controller';
import { GuidesRepository } from './guides.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { MembersModule } from '../members/members.module';
import { PersonalizeModule } from '../personalize/personalize.module';
import { PersonalizeService } from '../personalize/personalize.service';
import { PersonalizeEventsClient } from '@aws-sdk/client-personalize-events';

@Module({
  imports: [PrismaModule, MembersModule, PersonalizeModule],
  controllers: [GuidesController],
  providers: [GuidesService, GuidesRepository, PersonalizeService],
  exports: [GuidesService],
})
export class GuidesModule {}
