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

  // 경로 계산
  private async calculateDistances(data: PlanDistance, isCar: boolean = false) {
    const periods = Object.keys(data.list).map(Number);
    const allResults = [];

    // 각 기간별 플랜 경로 계산
    for (const period of periods) {
      const promises = data.list[period].map(async (originPlace, i) => {
        // 출발지 제외한 목적지 리스트 추출
        const destinations = isCar
          ? this.carExtractDestinations(data.list[period], originPlace)
          : this.busExtractDestinations(data.list[period], originPlace);
        const mode = data.transport;

        const response = isCar
          ? await this.calculateCarDistance(originPlace, destinations)
          : await this.calculateBusDistance(originPlace, destinations, mode);

        // 결과 데이터 포맷팅
        return this.formatResponseData(
          response,
          period,
          i,
          data.list[period],
          isCar,
        );
      });

      const results = await Promise.all(promises);
      allResults.push(results.flat());
    }

    return this.optimizeRoutes(allResults, periods, data);
  }

  // 버스 경로 계산
  async getBusDistance(data: PlanDistance) {
    return this.calculateDistances(data);
  }

  // 자동차 경로 계산
  async getCarDistance(data: PlanDistance) {
    return this.calculateDistances(data, true);
  }

  // 자동차 목적지 리스트
  private carExtractDestinations(list, originPlace) {
    return list
      .filter((place) => place.item.placeId !== originPlace.item.placeId)
      .map((place) => {
        return {
          y: place.item.latitude,
          x: place.item.longitude,
          key: place.item.id,
          id: place.item.placeId,
        };
      });
  }

  // 버스 목적지 리스트
  private busExtractDestinations(list, originPlace) {
    return list
      .filter((place) => place.item.placeId !== originPlace.item.placeId)
      .map((place) => place.item.placeId);
  }

  // 버스 거리 계산
  private async calculateBusDistance(
    originPlace,
    destinations,
    mode,
  ): Promise<any> {
    try {
      return await this.googleService.getDistance(
        originPlace.item.placeId,
        destinations,
        mode,
      );
    } catch (error) {
      throw new Error(`Failed to calculate bus distance: ${error.message}`);
    }
  }

  // 자동차 거리 계산
  private async calculateCarDistance(originPlace, destinations) {
    return await this.kakaoService.getDistance({
      origin: {
        y: originPlace.item.latitude,
        x: originPlace.item.longitude,
      },
      destinations: destinations,
      radius: 10000,
    });
  }

  // 결과 데이터 포맷팅
  private formatResponseData(response, period, i, list, isCar) {
    if (isCar) {
      return response.routes.map((route, index) => ({
        period,
        index: i,
        placeId: list[i].item.id,
        origin: list[i].item.placeId,
        destination: list[index].item.placeId,
        distance: route.summary.distance,
        duration: route.summary.duration,
      }));
    } else {
      return response.rows[0].elements.map((element, index) => ({
        period,
        index: i,
        placeId: list[i].item.id,
        origin: list[i].item.placeId,
        destination: list[index].item.placeId,
        distance: element.distance.value,
        duration: element.duration.value,
        durationTime: element.duration.text,
      }));
    }
  }

  // 경로 최적화
  private async optimizeRoutes(allResults, periods, data) {
    const responses = await Promise.all(
      allResults.map(async (r) => {
        return await this.ortoolsService.getRoute(r);
      }),
    );

    return this.formatOptimizedData(responses, periods, data);
  }

  // 최적화된 경로 데이터 포맷팅
  private formatOptimizedData(responses, periods, data) {
    const newData = {};

    // 각 기간별 최적화된 경로 데이터 포맷팅
    responses.forEach((response, index) => {
      const period = periods[index];
      newData[period] = [];

      response.forEach((res) => {
        const currentItem = data.list[period].find(
          (place) => place.item.id === res.id,
        );
        const nextItem = data.list[period].find(
          (place) => place.item.id === res.nextPlaceId,
        );

        if (typeof res.nextTime === 'number') {
          const minuate = Math.floor(res.nextTime / 60);
          res.nextTime = `${minuate}분`;
        }

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

      // 마지막에 첫 번째 아이템 추가
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
