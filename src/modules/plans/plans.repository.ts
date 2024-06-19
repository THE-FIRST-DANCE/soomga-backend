import { Injectable } from '@nestjs/common';
import { PlanDistance } from 'src/interfaces/google.interface';
import { GoogleHttpService } from 'src/modules/common/http/google-http.service';
import { KakaoHttpService } from 'src/modules/common/http/kakao-http.service';
import { OrtoolsService } from 'src/modules/common/http/ortools.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  ExecuteActivityDto,
  PlanAddDto,
  PlanCommentDto,
  PlanExecuteDto,
} from './dto/plans.dto';
import { Plan } from '@prisma/client';

@Injectable()
export class PlansRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleService: GoogleHttpService,
    private readonly ortoolsService: OrtoolsService,
    private readonly kakaoService: KakaoHttpService,
  ) {}

  // 플랜 가져오기
  async getPlan(authorId: number) {
    try {
      return await this.prismaService.plan.findMany({
        where: {
          authorId: Number(authorId),
        },
        include: {
          daySchedules: {
            include: {
              schedules: {
                include: {
                  item: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to get plans: ${error.message}`);
    }
  }

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
    console.log(
      '🚀 ~ PlansRepository ~ formatResponseData ~ response:',
      response,
    );

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
        distance: element.distance ? element.distance.value : null,
        duration: element.duration ? element.duration.value : null,
        durationTime: element.duration ? element.duration.text : null,
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
            stayTime: currentItem.stayTime,
            nextTime: res.nextTime,
            nextPlaceId: res.nextPlaceId,
            nextPlaceGoogleId: nextItem.item.placeId,
            nextLat: nextItem.item.latitude,
            nextLng: nextItem.item.longitude,
            nextPlaceName: nextItem.item.name,
            description: '',
          });
        }
      });

      // 마지막에 첫 번째 아이템 추가
      if (data.list[period].length > 0) {
        const firstItem = data.list[period][0];
        newData[period].push({
          item: firstItem.item,
          stayTime: firstItem.stayTime,
          nextTime: null,
          nextPlaceId: null,
          nextPlaceGoogleId: null,
          nextLat: null,
          nextLng: null,
          nextPlaceName: null,
          description: '',
        });
      }
    });

    return newData;
  }

  // 단일 목적지 결과 데이터 포맷팅
  private formatSingResponseData(
    response,
    period,
    originPlace,
    nextPlace,
    i,
    isCar,
  ) {
    if (isCar) {
      return response.routes.map((route) => ({
        period,
        index: i,
        placeId: originPlace.item.id,
        origin: originPlace.item.placeId,
        destination: nextPlace.item.placeId,
        distance: route.summary.distance,
        duration: route.summary.duration,
      }));
    } else {
      return response.rows[0].elements.map((element) => ({
        period,
        index: i,
        placeId: originPlace.item.id,
        origin: originPlace.item.placeId,
        destination: nextPlace.item.placeId,
        distance: element.distance ? element.distance.value : null,
        duration: element.duration ? element.duration.value : null,
        durationTime: element.duration ? element.duration.text : null,
      }));
    }
  }

  // 단일 목적지 경로 계산
  async getSingleDistance(data: PlanDistance, isCar: boolean = false) {
    const periods = Object.keys(data.list).map(Number);
    const allResults = [];

    for (const period of periods) {
      const places = data.list[period];
      places.push(places[0]);

      for (let i = 0; i < places.length; i++) {
        const originPlace = places[i];

        if (i + 1 < places.length) {
          const nextPlace = places[i + 1];

          const response = isCar
            ? await this.calculateCarDistance(originPlace, [
                {
                  y: nextPlace.item.latitude,
                  x: nextPlace.item.longitude,
                  key: nextPlace.item.id,
                  id: nextPlace.item.placeId,
                },
              ])
            : await this.calculateBusDistance(
                originPlace,
                [nextPlace.item.placeId],
                data.transport,
              );

          allResults.push(
            this.formatSingResponseData(
              response,
              period,
              originPlace,
              nextPlace,
              i,
              isCar,
            ),
          );
        }
      }
    }

    return this.formatSingleDistance(data, allResults, periods);
  }

  // 단일 목적지 결과 데이터 포맷팅
  async formatSingleDistance(data, allResults, periods) {
    const resultData = {};

    const formatData = allResults.flat();

    periods.forEach((period) => {
      // period에 해당하는 모든 결과 필터링
      const filteredResults = formatData.filter(
        (result) => result.period === period,
      );

      // 결과 매핑
      const mappedResults = filteredResults.map((result, index) => {
        // 마지막 항목이면 next 값들을 null로 설정
        if (index === filteredResults.length - 1) {
          return {
            item: data.list[period].find(
              (place) => place.item.id === result.placeId,
            )?.item,
            stayTime: data.list[period].find(
              (place) => place.item.id === result.placeId,
            )?.stayTime,
            nextTime: null,
            nextPlaceId: null,
            nextPlaceGoogleId: null,
            nextLat: null,
            nextLng: null,
            nextPlaceName: null,
            description: '',
          };
        } else {
          return {
            item: data.list[period].find(
              (place) => place.item.id === result.placeId,
            )?.item,
            stayTime: data.list[period].find(
              (place) => place.item.id === result.placeId,
            )?.stayTime,
            nextTime: `${Math.floor(result.duration / 60)}분`,
            nextPlaceId: data.list[period].find(
              (place) => place.item.placeId === result.destination,
            )?.item.id,
            nextPlaceGoogleId: result.destination,
            nextLat: data.list[period].find(
              (place) => place.item.placeId === result.destination,
            )?.item.latitude,
            nextLng: data.list[period].find(
              (place) => place.item.placeId === result.destination,
            )?.item.longitude,
            nextPlaceName: data.list[period].find(
              (place) => place.item.placeId === result.destination,
            )?.item.name,
            description: '',
          };
        }
      });

      resultData[period] = mappedResults;
    });

    return resultData;
  }

  // 플랜 편집
  async editPlaceOrder(data: PlanDistance) {
    const transport = data.transport;
    const results = await this.getSingleDistance(data, transport === 'driving');

    return results;
  }

  // 스케줄 저장
  async saveOrUpdateSchedule(data: PlanAddDto) {
    try {
      let plan: Plan;
      if (data.planId) {
        // 기존 플랜을 찾아 업데이트
        plan = await this.prismaService.plan.findUnique({
          where: { id: data.planId },
        });

        if (!plan) {
          throw new Error('Plan not found.');
        }

        if (plan.authorId !== data.memberId) {
          plan = await this.prismaService.plan.create({
            data: {
              title: data.title,
              region: data.region,
              authorId: data.memberId, // memberId를 authorId로 사용
              transport: data.transport,
              period: data.period,
            },
          });
        } else {
          plan = await this.prismaService.plan.update({
            where: {
              id: data.planId,
            },
            data: {
              title: data.title,
              region: data.region,
              transport: data.transport,
              period: data.period,
              daySchedules: {
                deleteMany: {},
              },
            },
          });
        }
      } else {
        // 새로운 플랜 생성
        plan = await this.prismaService.plan.create({
          data: {
            title: data.title,
            region: data.region,
            authorId: data.memberId, // memberId를 authorId로 사용
            transport: data.transport,
            period: data.period,
          },
        });
      }

      // 연결된 일정 생성 또는 업데이트 로직
      for (let i = 1; i < data.period + 1; i++) {
        const daySchedule = await this.prismaService.daySchedule.create({
          data: {
            day: i,
            planId: plan.id,
          },
        });

        // 일정에 연결된 스케줄 생성 또는 업데이트 로직
        for (let j = 0; j < data.list[i].length; j++) {
          const item = data.list[i][j];

          await this.prismaService.schedule.create({
            data: {
              dayScheduleId: daySchedule.id,
              placeId: item.item.id,
              stayTime: item.stayTime,
              nextLat: item.nextLat,
              nextLng: item.nextLng,
              nextTime: item.nextTime,
              nextPlaceName: item.nextPlaceName,
              nextPlaceId: item.nextPlaceId,
              description: item.description,
            },
          });
        }
      }
    } catch (error) {
      throw new Error(`Failed to save or update schedule: ${error.message}`);
    }
  }

  // 플랜 id로 가져오기
  async getPlanById(planId: number) {
    try {
      return await this.prismaService.plan.findUnique({
        where: {
          id: planId,
        },
        include: {
          daySchedules: {
            include: {
              schedules: {
                include: {
                  item: true,
                },
              },
            },
          },
          author: true,
          comments: {
            include: {
              member: true,
            },
          },
          executedPlan: {
            include: {
              author: true,
              executedActivity: {
                include: {
                  schedule: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to get plan by id: ${error.message}`);
    }
  }

  // 플랜 user id로 가져오기
  async getPlanByUserId(userId: number) {
    try {
      return await this.prismaService.plan.findMany({
        where: {
          authorId: userId,
        },
        include: {
          daySchedules: {
            include: {
              schedules: {
                include: {
                  item: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to get plan by user id: ${error.message}`);
    }
  }

  // 플랜 삭제
  async deletePlan(planId: number) {
    try {
      return await this.prismaService.plan.delete({
        where: {
          id: planId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to delete plan: ${error.message}`);
    }
  }

  // 플랜 댓글 작성
  addComment(planCommentDto: PlanCommentDto) {
    return this.prismaService.planComment.create({
      data: {
        content: planCommentDto.content,
        memberId: planCommentDto.memberId,
        planId: planCommentDto.planId,
      },
    });
  }

  // 플랜 댓글 불러오기
  getComments(planId: number) {
    return this.prismaService.planComment.findMany({
      where: {
        planId: planId,
      },
    });
  }

  // 플랜 댓글 삭제
  deleteComment(commentId: number) {
    return this.prismaService.planComment.delete({
      where: {
        id: commentId,
      },
    });
  }

  // 플랜 id 와 일차로 일과 가져오기
  getPlanWithDaySchedules(planId: number, period: number) {
    return this.prismaService.plan.findUnique({
      where: {
        id: planId,
      },
      include: {
        daySchedules: {
          where: {
            day: period,
          },
          include: {
            schedules: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });
  }

  // 플랜 실행
  async executePlan(planId: number, memberId: number) {
    const existingExecutedPlan =
      await this.prismaService.executedPlan.findFirst({
        where: {
          planId,
          authorId: memberId,
        },
      });

    if (existingExecutedPlan) {
      return existingExecutedPlan.id;
    } else {
      // 해당 planId와 authorId를 가진 데이터가 없을 경우 새로운 executedPlan 생성
      const newExecutedPlan = await this.prismaService.executedPlan.create({
        data: {
          planId,
          authorId: memberId,
        },
      });
      return newExecutedPlan.id;
    }
  }

  // 플랜 일과 실행
  async executedActivity(data: ExecuteActivityDto) {
    const existingExecutedActivity =
      await this.prismaService.executedActivity.findFirst({
        where: {
          executedPlanId: data.executedPlanId,
          scheduleId: data.scheduleId,
        },
      });

    if (existingExecutedActivity) {
      // 이미 실행된 일과가 있을 경우 업데이트
      return this.prismaService.executedActivity.update({
        where: {
          id: existingExecutedActivity.id,
        },
        data: {
          note: data.note,
          photos: data.photos,
        },
      });
    } else {
      // 실행된 일과가 없을 경우 새로 생성
      return this.prismaService.executedActivity.create({
        data: {
          authorId: data.memberId,
          scheduleId: data.scheduleId,
          executedPlanId: data.executedPlanId,
          note: data.note,
          photos: data.photos,
        },
      });
    }
  }
}
