import { Module } from '@nestjs/common';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AreasRepository } from './areas.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AreasController],
  providers: [PrismaService, AreasService, AreasRepository],
  exports: [AreasService, AreasRepository],
})
export class AreasModule {}
