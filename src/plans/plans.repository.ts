import { Injectable } from '@nestjs/common';
import { PlanDistance } from 'src/interfaces/google.interface';
import { GoogleHttpService } from 'src/modules/common/http/google-http.service';
import { KakaoHttpService } from 'src/modules/common/http/kakao-http.service';
import { OrtoolsService } from 'src/modules/common/http/ortools.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PlansRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleService: GoogleHttpService,
    private readonly ortoolsService: OrtoolsService,
    private readonly kakaoService: KakaoHttpService,
  ) {}

  // 버스 경로 계산
  async getAllDistance(data: PlanDistance) {
    const periods = Object.keys(data.list).map(Number);
    const allResults = [];

    for (const period of periods) {
      const promises = data.list[period].map(async (originPlace, i) => {
        const destinations = data.list[period]
          .filter((place) => place.item.placeId !== originPlace.item.placeId)
          .map((place) => place.item.placeId);

        const mode = data.transport;

        const response = await this.googleService.getDistance(
          originPlace.item.placeId,
          destinations,
          mode,
        );

        const { rows } = response;

        return rows[0].elements.map((element, index) => ({
          period,
          index: i,
          placeId: data.list[period][i].item.id,
          origin: data.list[period][i].item.placeId,
          destination: destinations[index],
          distance: element.distance.value,
          duration: element.duration.value,
          durationTime: element.duration.text,
        }));
      });

      const results = await Promise.all(promises);
      allResults.push(results.flat());
    }

    const responses = await Promise.all(
      allResults.map(async (r) => {
        return await this.ortoolsService.getRoute(r);
      }),
    );

    const newData = {};

    responses.forEach((response, index) => {
      const period = periods[index];
      newData[period] = [];

      response.forEach((res) => {
        // 현재 위치의 item 정보를 찾습니다.
        const currentItem = data.list[period].find(
          (place) => place.item.id === res.id,
        );

        // 다음 위치의 item 정보를 찾습니다.
        const nextItem = data.list[period].find(
          (place) => place.item.id === res.nextPlaceId,
        );

        if (currentItem && nextItem) {
          newData[period].push({
            item: currentItem.item,
            time: res.time,
            nextTime: res.nextTime,
            nextPlaceId: res.nextPlaceId,
            nextPlaceGoogleId: nextItem.item.placeId,
            nextLat: nextItem.item.latitude,
            nextLng: nextItem.item.longitude,
            nextPlaceName: nextItem.item.name,
          });
        }
      });

      if (data.list[period].length > 0) {
        const firstItem = data.list[period][0];
        newData[period].push({
          item: firstItem.item,
          time: null,
          nextTime: null,
          nextPlaceId: null,
          nextPlaceGoogleId: null,
          nextLat: null,
          nextLng: null,
          nextPlaceName: null,
        });
      }
    });

    return newData;
  }

  // 차 경로 계산
  async getCarDistance(data: PlanDistance) {
    const periods = Object.keys(data.list).map(Number);
    const allResults = [];

    for (const period of periods) {
      const promises = data.list[period].map(async (originPlace, i) => {
        const destinations = data.list[period]
          .filter((place) => place.item.placeId !== originPlace.item.placeId)
          .map((place) => {
            return {
              y: place.item.latitude,
              x: place.item.longitude,
              key: place.item.id,
              id: place.item.placeId,
            };
          });

        const response = await this.kakaoService.getDistance({
          origin: {
            y: originPlace.item.latitude,
            x: originPlace.item.longitude,
          },
          destinations: destinations,
          radius: 10000,
        });

        return response.routes.map((route, index) => ({
          period,
          index: i,
          placeId: data.list[period][i].item.id,
          origin: data.list[period][i].item.placeId,
          destination: destinations[index].id,
          distance: route.summary.distance,
          duration: route.summary.duration,
        }));
      });

      const results = await Promise.all(promises);
      allResults.push(results.flat());
    }

    const responses = await Promise.all(
      allResults.map(async (r) => {
        return await this.ortoolsService.getRoute(r);
      }),
    );

    const newData = {};

    responses.forEach((response, index) => {
      const period = periods[index];
      newData[period] = [];

      response.forEach((res) => {
        // 현재 위치의 item 정보를 찾습니다.
        const currentItem = data.list[period].find(
          (place) => place.item.id === res.id,
        );

        // 다음 위치의 item 정보를 찾습니다.
        const nextItem = data.list[period].find(
          (place) => place.item.id === res.nextPlaceId,
        );

        const covertToTime = (duration) => {
          const minuate = Math.floor(duration / 60);
          return `${minuate}분`;
        };

        if (currentItem && nextItem) {
          newData[period].push({
            item: currentItem.item,
            time: res.time,
            nextTime: covertToTime(res.nextTime),
            nextPlaceId: res.nextPlaceId,
            nextPlaceGoogleId: nextItem.item.placeId,
            nextLat: nextItem.item.latitude,
            nextLng: nextItem.item.longitude,
            nextPlaceName: nextItem.item.name,
          });
        }
      });

      if (data.list[period].length > 0) {
        const firstItem = data.list[period][0];
        newData[period].push({
          item: firstItem.item,
          time: null,
          nextTime: null,
          nextPlaceId: null,
          nextPlaceGoogleId: null,
          nextLat: null,
          nextLng: null,
          nextPlaceName: null,
        });
      }
    });

    return newData;
  }
}
