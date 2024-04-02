import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OrtoolsPostData } from 'src/interfaces/ortools.interface';

@Injectable()
export class OrtoolsService {
  async getRoute(data: OrtoolsPostData[]) {
    try {
      const response = await axios.post('http://127.0.0.1:5001/distance', data);

      // 결과를 저장할 배열
      const result = [];
      const dataIndexMap = new Map(data.map((item) => [item.index, item]));

      // response.data의 각 요소에 대해 처리
      response.data.forEach((element, i) => {
        const nextElement = response.data[i + 1];
        const current = dataIndexMap.get(element);
        const next = dataIndexMap.get(nextElement);

        if (current && next) {
          result.push({
            id: current.placeId,
            placeId: current.origin,
            nextTime: current.durationTime
              ? current.durationTime
              : current.duration,
            nextPlaceId: next.placeId,
            nextPlaceGoogleId: next.origin,
          });
        }
      });

      return result;
    } catch (error) {
      // 네트워크 요청 실패 또는 기타 에러를 처리
      console.error('Failed to fetch route data:', error);
      throw error;
    }
  }
}
