import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { GooglePlaceResponse } from '../../interfaces/google.interface';
import { PlaceAddDto } from './dto/place.dto';
import { Place } from '@prisma/client';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('/search')
  async searchPlace(
    @Query()
    queryparams: {
      query: string;
      pagetoken: string;
      location: string;
    },
  ): Promise<GooglePlaceResponse> {
    const { query, pagetoken = null, location } = queryparams;
    return this.placesService.searchPlace(query, pagetoken, location);
  }

  @Get()
  async getPlaces(@Query() param: { category: string; region: string }) {
    const { category, region } = param;
    return this.placesService.getPlaces(category, region);
  }

  @Post('/add')
  async addPlace(@Body() place: PlaceAddDto): Promise<Place> {
    return this.placesService.addPlace(place);
  }
}
