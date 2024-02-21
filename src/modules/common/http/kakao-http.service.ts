import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface KakaoDistance {
  origin: KakaoTranscoord;
  destinations: KakaoTranscoord[];
  radius: number;
}

interface KakaoTranscoord {
  x: number;
  y: number;
}

@Injectable()
export class KakaoHttpService {
  async getDistance(data: KakaoDistance) {
    const response = await axios.post(
      'https://apis-navi.kakaomobility.com/v1/destinations/directions',
      data,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
}
