import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlacesRepository } from './places.repository';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleHttpService } from '../common/http/google-http.service';

@Module({
  controllers: [PlacesController],
  providers: [
    PlacesService,
    PlacesRepository,
    PrismaService,
    GoogleHttpService,
  ],
  exports: [PlacesService, PlacesRepository, GoogleHttpService],
})
export class PlacesModule {}
