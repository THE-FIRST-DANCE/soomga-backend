import { Injectable } from '@nestjs/common';
import { PlacesRepository } from './places.repository';
import { GooglePlaceResponse } from 'src/interfaces/google.interface';
import { PlaceAddDto } from './dto/place.dto';
import { Place } from '@prisma/client';

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

  async getPlaces(category: string, region: string) {
    console.log(category, region);
    return this.placesRepository.getPlaces(category, region);
  }

  async addPlace(place: PlaceAddDto): Promise<Place> {
    return this.placesRepository.addPlace(place);
  }
}
