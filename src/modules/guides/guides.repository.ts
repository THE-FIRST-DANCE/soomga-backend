import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { RegisterGuideDto } from './dto/register-guide.dto';
import { MembersRepository } from '../members/members.repository';
import {
  GuidePaginatedData,
  GuidePaginationOptions,
  GuideWithMatchingAvgScore,
} from './guides.interface';
import { DateHelpers } from 'src/shared/helpers/date.helpers';

@Injectable()
export class GuidesRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly membersRepository: MembersRepository,
  ) {}

  async findAll() {
    return this.prismaService.member.findMany({
      where: { role: Role.GUIDE },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        birthdate: true,
        email: true,
        gender: true,
        provider: true,
        providerId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        guideProfile: true,
      },
    });
  }

  async paginate(
    cursor?: number,
    limit = 10,
    options?: GuidePaginationOptions,
  ) {
    const whereCondition = this.buildWhereCondition(cursor, options);
    const orderBy = this.buildOrderBy(options);

    const guidesWithMatchingAvgScores =
      await this.getGuidesWithMatchingAvgScores(
        options?.score ?? [0, 1, 2, 3, 4, 5],
      );

    const guides: GuidePaginatedData[] =
      await this.prismaService.member.findMany({
        where: whereCondition,
        take: limit,
        orderBy: orderBy,
        select: {
          id: true,
          nickname: true,
          avatar: true,
          birthdate: true,
          languages: {
            select: {
              language: true,
            },
          },
          guideProfile: {
            select: {
              areas: {
                select: {
                  area: true,
                },
              },
              temperature: true,
            },
          },
          guideReviews: {},
          tags: {
            select: {
              tag: true,
            },
          },
        },
      });

    const result = this.enrichGuides(guides, {
      guidesWithMatchingAvgScores,
    });

    return result;
  }

  private enrichGuides(
    guides: GuidePaginatedData[],
    additional: {
      guidesWithMatchingAvgScores?: GuideWithMatchingAvgScore[];
    },
  ) {
    const { guidesWithMatchingAvgScores } = additional;

    if (guidesWithMatchingAvgScores) {
      return guides.map((guide) => {
        const matching = guidesWithMatchingAvgScores.find(
          (item) => item.guideId === guide.id,
        );

        return {
          ...guide,
          avgLocationScore: +matching?.avgLocationScore || 0,
          avgKindnessScore: +matching?.avgKindnessScore || 0,
          avgCommunicationScore: +matching?.avgCommunicationScore || 0,
          totalAvgScore: +matching?.totalAvgScore || 0,
        };
      });
    }
  }

  private buildOrderBy({
    orderBy,
    sort,
  }: Pick<
    GuidePaginationOptions,
    'orderBy' | 'sort'
  >): Prisma.MemberOrderByWithRelationInput {
    if (!orderBy) {
      return { id: 'desc' };
    }

    if (orderBy === 'guideCount') {
      return { guideReviews: { _count: sort } };
    }

    if (orderBy === 'temperature') {
      return { guideProfile: { temperature: sort } };
    }
  }

  private buildWhereCondition(
    cursor?: number,
    options?: GuidePaginationOptions,
  ): Prisma.MemberWhereInput {
    const {
      areas,
      age,
      gender,
      guideCount,
      languageCertifications,
      languages,
      score,
      temperature,
    } = options;

    const whereCondition: Prisma.MemberWhereInput = {
      role: Role.GUIDE,
    };

    if (cursor) {
      whereCondition.id = { lt: cursor };
    }

    if (gender) {
      whereCondition.gender = options.gender;
    }

    if (age) {
      const { start, end } = DateHelpers.calculateBirthdateRange(
        age.min,
        age.max,
      );
      whereCondition.birthdate = {
        gte: start,
        lte: end,
      };
    }

    // TODO:
    // guideCount

    if (temperature) {
      whereCondition.guideProfile = {
        temperature: {
          gte: temperature.min,
          lte: temperature.max,
        },
      };
    }

    if (areas) {
      whereCondition.guideProfile = {
        areas: {
          some: {
            areaId: { in: areas },
          },
        },
      };
    }

    if (languages) {
      whereCondition.languages = {
        some: {
          languageId: { in: languages },
        },
      };
    }

    if (languageCertifications) {
      whereCondition.guideProfile = {
        languageCertifications: {
          some: {
            languageCertificationId: { in: languageCertifications },
          },
        },
      };
    }

    return whereCondition;
  }

  async getGuidesWithMatchingAvgScores(
    scores: number[],
  ): Promise<GuideWithMatchingAvgScore[]> {
    return this.prismaService.$queryRaw`
      SELECT
        "guideId",
        AVG("communicationScore") AS "avgCommunicationScore",
        AVG("kindnessScore") AS "avgKindnessScore",
        AVG("locationScore") AS "avgLocationScore",
        ROUND((AVG("communicationScore") + AVG("kindnessScore") + AVG("locationScore")) / 3) AS "totalAvgScore"
      FROM
        Public."GuideReview"
      GROUP BY
        "guideId"
      HAVING
        ROUND((AVG("communicationScore") + AVG("kindnessScore") + AVG("locationScore")) / 3) = ANY(${scores})
    `;
  }

  /**
   * 특정 가이드 정보를 조회합니다.
   * @param id - 가이드의 고유 식별자
   */
  async findOne(id: number) {
    return this.prismaService.member.findUnique({
      where: { id, role: Role.GUIDE },
      select: {
        avatar: true,
        birthdate: true,
        boardLikes: true,
        guideProfile: true,
      },
    });
  }

  /**
   * 가이드를 등록하는 메서드입니다.
   * @param id - 가이드의 ID
   * @param registerGuideDto - 가이드 등록에 필요한 정보를 담은 DTO (Data Transfer Object)
   */
  async registerGuide(id: number, registerGuideDto: RegisterGuideDto) {
    const { areaIds, languageCertificationIds, languageIds } = registerGuideDto;

    // 가이드로 역할을 변경합니다. 가이드 프로필을 생성합니다.
    await this.prismaService.member.update({
      where: { id },
      data: {
        role: Role.GUIDE,
        guideProfile: {
          upsert: {
            where: {
              id,
            },
            create: {},
            update: {},
          },
        },
      },
    });

    await this.membersRepository.updateLanguages(id, languageIds);
    await this.updateAreas(id, areaIds);
    await this.updateLanguageCertifications(id, languageCertificationIds);
  }

  /**
   * 지역 정보를 업데이트합니다.
   * @param id - 가이드 멤버의 식별자
   * @param areaIds - 업데이트할 지역 식별자 목록
   */
  async updateAreas(id: number, areaIds: number[]) {
    const currentAreaIds = await this.prismaService.guideArea
      .findMany({
        where: { guide: { id } },
        select: {
          areaId: true,
        },
      })
      .then((result) => result.map(({ areaId }) => areaId));
    const areaIdsToCreate = areaIds.filter(
      (id) => !currentAreaIds.includes(id),
    );
    const areaIdsToDelete = currentAreaIds.filter(
      (id) => !areaIds.includes(id),
    );

    if (areaIdsToCreate.length === 0 && areaIdsToDelete.length === 0) {
      return;
    }

    return this.prismaService.guideProfile.update({
      where: { id },
      data: {
        areas: {
          deleteMany: {
            areaId: { in: areaIdsToDelete },
          },
          createMany: {
            data: areaIdsToCreate.map((areaId) => ({ areaId })),
          },
        },
      },
    });
  }

  /**
   * 언어 자격증을 업데이트합니다.
   * @param id - 가이드의 식별자
   * @param languageCertificationIds - 업데이트할 언어 인증서 식별자 목록
   */
  async updateLanguageCertifications(
    id: number,
    languageCertificationIds: number[],
  ) {
    const currentLanguageCertificationIds =
      await this.prismaService.guideLanguageCertification
        .findMany({
          where: {
            guide: { id },
          },
          select: {
            languageCertificationId: true,
          },
        })
        .then((result) =>
          result.map(({ languageCertificationId }) => languageCertificationId),
        );
    const languageCertificationIdsToCreate = languageCertificationIds.filter(
      (id) => !currentLanguageCertificationIds.includes(id),
    );
    const languageCertificationIdsToDelete =
      currentLanguageCertificationIds.filter(
        (id) => !languageCertificationIds.includes(id),
      );

    if (
      languageCertificationIdsToCreate.length === 0 &&
      languageCertificationIdsToDelete.length === 0
    ) {
      return;
    }

    return this.prismaService.guideProfile.update({
      where: { id },
      data: {
        languageCertifications: {
          deleteMany: {
            languageCertificationId: { in: languageCertificationIdsToDelete },
          },
          createMany: {
            data: languageCertificationIdsToCreate.map(
              (languageCertificationId) => ({
                languageCertificationId,
              }),
            ),
          },
        },
      },
    });
  }

  async updateService(id: number, content: string) {
    return this.prismaService.guideProfile.update({
      where: { id },
      data: { service: content },
    });
  }


  /**
   * 가이드에서 탈퇴하고, 멤버의 역할을 USER로 업데이트합니다.
   * @param id - 제거할 가이드의 ID.
   */
  async leaveGuide(id: number) {
    return this.prismaService.$transaction([
      this.prismaService.guideProfile.delete({
        where: { id },
      }),
      this.prismaService.member.update({
        where: { id },
        data: { role: Role.USER },
      }),
    ]);
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.prismaService.guideProfile.findUnique({
      where: { phoneNumber },
    });
  }

  async registerPhoneNumber(id: number, phoneNumber: string) {
    return this.prismaService.guideProfile.update({
      where: { id },
      data: { phoneNumber },
    });
  }
}
