import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OrtoolsPostData } from 'src/interfaces/ortools.interface';

@Injectable()
export class OrtoolsService {
  async getRoute(data: OrtoolsPostData[]) {
    const response = await axios.post('http://127.0.0.1:5000/distance', data);

    const result = [];

    for (let i = 0; i < response.data.length; i++) {
      const element = response.data[i];
      const destination = data.find((d) => d.index === response.data[i + 1]);

      if (destination) {
        data.forEach((d) => {
          if (d.index === element && d.destination === destination.origin) {
            result.push({
              id: d.placeId,
              placeId: d.origin,
              nextTime: d.durationTime ? d.durationTime : d.duration,
              nextPlaceId: destination.placeId,
              nextPlaceGoogleId: destination.origin,
            });
          }
        });
      }
    }

    return result;
  }
}
