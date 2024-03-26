import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PlansRepository } from './plans.repository';
import { GoogleHttpService } from '../common/http/google-http.service';
import { OrtoolsService } from '../common/http/ortools.service';
import { KakaoHttpService } from '../common/http/kakao-http.service';

@Module({
  controllers: [PlansController],
  providers: [
    PlansService,
    PlansRepository,
    PrismaService,
    GoogleHttpService,
    OrtoolsService,
    KakaoHttpService,
  ],
  exports: [PlansService, PrismaService, PlansRepository],
})
export class PlansModule {}
