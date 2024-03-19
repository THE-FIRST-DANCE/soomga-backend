import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { GooglePlaceResponse } from '../../interfaces/google.interface';
import { PlaceAddDto } from './dto/place.dto';
import { Place } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('장소 API')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @ApiOperation({
    summary: '장소 검색',
    description: '구글 장소 검색 API를 이용하여 장소를 검색합니다.',
  })
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

  @ApiOperation({
    summary: '장소 조회',
    description: '카테고리와 지역을 기준으로 장소를 조회합니다.',
  })
  @Get()
  async getPlaces(@Query() param: { category: string; region: string }) {
    const { category, region } = param;
    return this.placesService.getPlaces(category, region);
  }

  @ApiOperation({
    summary: '장소 추가',
    description: '새로운 장소를 추가합니다.',
  })
  @Post('/add')
  async addPlace(@Body() place: PlaceAddDto): Promise<Place> {
    return this.placesService.addPlace(place);
  }
}
