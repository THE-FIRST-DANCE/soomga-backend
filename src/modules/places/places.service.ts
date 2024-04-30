import { Injectable } from '@nestjs/common';
import { PlacesRepository } from './places.repository';
import { GooglePlaceResponse } from '../../interfaces/google.interface';
import { PlaceAddDto } from './dto/place.dto';
import { Place } from '@prisma/client';
import { createPageResponse } from '../../shared/pagination/pagination.utils';

@Injectable()
export class PlacesService {
  constructor(private readonly placesRepository: PlacesRepository) {}

  async searchPlace(
    query: string,
    pagetoken: string,
    location: string,
  ): Promise<GooglePlaceResponse> {
    return this.placesRepository.searchPlaces(query, pagetoken, location);
  }

  async getPlaces(
    category: string,
    region: string,
    cursor: number,
    limit: number,
    search: string,
  ) {
    const places = await this.placesRepository.getPlaces(
      category,
      region,
      cursor,
      limit,
      search,
    );

    return createPageResponse(places, { cursor, limit }, places.length);
  }

  async addPlace(place: PlaceAddDto): Promise<Place> {
    return this.placesRepository.addPlace(place);
  }
}
