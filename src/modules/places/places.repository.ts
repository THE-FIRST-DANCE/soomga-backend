import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleHttpService } from '../common/http/google-http.service';
import { GooglePlaceResponse } from '../../interfaces/google.interface';
import { PlaceAddDto } from './dto/place.dto';
import { Place } from '@prisma/client';
import axios from 'axios';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class PlacesRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleService: GoogleHttpService,
    private readonly awsService: AwsService,
  ) {}

  // 장소 검색
  async searchPlaces(query: string, pagetoken: string, location: string) {
    const places = await this.googleService.searchPlaces(
      query,
      pagetoken,
      location,
    );

    return places;
  }

  // 장소 상세 정보
  async getDetail(placeId: string) {
    const placeDetail = await this.googleService.getPlaceDetail(placeId);

    return placeDetail;
  }

  // 장소 목록
  getPlaces(
    category: string,
    region: string,
    cursor: number,
    limit: number,
    search: string,
  ): Promise<Place[]> {
    if (category === 'all') {
      console.log(search);
      return this.prismaService.place.findMany({
        where: {
          id: { lt: cursor },
          region,
          name: {
            contains: search,
          },
        },
        take: limit,
        orderBy: {
          id: 'desc',
        },
      });
    }

    return this.prismaService.place.findMany({
      where: {
        id: { lt: cursor },
        region,
        category,
        name: {
          contains: search,
        },
      },
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });
  }

  // 장소 추가
  async addPlace(place: PlaceAddDto): Promise<Place> {
    try {
      const placeExist = await this.prismaService.place.findUnique({
        where: {
          placeId: place.placeId,
        },
      });

      if (placeExist) {
        throw new Error('Place already exists');
      }

      const placeDetail = await this.getDetail(place.placeId);

      const photoUrl = await this.awsService.uploadFileFromUrl(
        place.photo,
        `${place.placeId}.jpg`,
      );

      const createPlace = await this.prismaService.place.create({
        data: {
          name: place.name,
          placeId: place.placeId,
          rating: place.rating,
          address: place.address,
          photo: photoUrl,
          category: place.category,
          latitude: place.latitude,
          longitude: place.longitude,
          region: place.region,
          url: placeDetail.result.url,
          phone: placeDetail.result.formatted_phone_number ?? '',
          detailAddress: placeDetail.result.formatted_address,
        },
      });

      if (placeDetail.result.opening_hours) {
        const periods = placeDetail.result.opening_hours.periods.map(
          (period) => {
            return {
              close: period.close?.time ?? '',
              open: period.open.time,
              day: period.open.day,
            };
          },
        );

        await this.prismaService.openingHours.createMany({
          data: periods.map((period) => {
            return {
              closeTime: period.close,
              openTime: period.open,
              dayOfWeek: period.day,
              placeId: createPlace.id,
            };
          }),
        });
      }

      return createPlace;
    } catch (error) {
      throw new Error('Failed to add place' + error);
    }
  }
}
