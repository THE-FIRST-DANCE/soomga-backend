import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleHttpService } from '../common/http/google-http.service';
import { GooglePlaceResponse } from 'src/interfaces/google.interface';
import { PlaceAddDto } from './dto/place.dto';
import { Place } from '@prisma/client';

@Injectable()
export class PlacesRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleService: GoogleHttpService,
  ) {}

  async searchPlaces(
    query: string,
    pagetoken: string,
    location: string,
  ): Promise<GooglePlaceResponse> {
    return this.googleService.searchPlaces(query, pagetoken, location);
  }

  async getPlaces(category: string, region: string) {
    if (category === 'all') {
      return await this.prismaService.place.findMany({
        where: {
          region,
        },
      });
    }

    return await this.prismaService.place.findMany({
      where: {
        category,
        region,
      },
    });
  }

  async addPlace(place: PlaceAddDto): Promise<Place> {
    const placeExist = await this.prismaService.place.findUnique({
      where: {
        placeId: place.placeId,
      },
    });

    if (placeExist) {
      throw new Error('Place already exist');
    }

    const createPlace = await this.prismaService.place.create({
      data: {
        name: place.name,
        placeId: place.placeId,
        rating: place.rating,
        address: place.address,
        photo: place.photo,
        category: place.category,
        latitude: place.latitude,
        longitude: place.longitude,
        region: place.region,
      },
    });

    return createPlace;
  }
}
