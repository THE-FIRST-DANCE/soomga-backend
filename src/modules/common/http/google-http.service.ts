import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  GooglePlaceDetail,
  GooglePlaceResponse,
} from 'src/interfaces/google.interface';

@Injectable()
export class GoogleHttpService {
  async searchPlaces(
    query: string,
    pagetoken: string,
    location: string,
  ): Promise<GooglePlaceResponse> {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          key: process.env.GOOGLE_CLIENT_SEARCH_ID,
          keyword: query,
          location,
          radius: 8000,
          pagetoken,
          language: 'ko',
        },
      },
    );
    return response.data;
  }

  async getPlaceDetail(placeId: string): Promise<GooglePlaceDetail> {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          key: process.env.GOOGLE_CLIENT_SEARCH_ID,
          place_id: placeId,
          language: 'ko',
        },
      },
    );

    return response.data;
  }

  async getDistance(origin: string, destinations: string[], mode: string) {
    const origins = 'place_id:' + origin;
    const destinationsString = destinations
      .map((destination) => 'place_id:' + destination)
      .join('|');

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/distancematrix/json',
      {
        params: {
          key: process.env.GOOGLE_CLIENT_SEARCH_ID,
          origins,
          destinations: destinationsString,
          mode: mode,
          language: 'ko',
        },
      },
    );

    return response.data;
  }
}
