import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GuideProfile, Prisma, Role } from '@prisma/client';
import { RegisterGuideDto } from './dto/register-guide.dto';
import { MembersRepository } from '../members/members.repository';
import {
  GuidePaginationOptions,
  GuideReviewPaginationOptions,
  GuideWithMatchingAvgScore,
} from './guides.interface';
import { DateHelpers } from 'src/shared/helpers/date.helpers';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
    const guideAvgScores = await this.getGuidesWithMatchingAvgScores(
      options.score,
    );

    const whereCondition = this.buildWhereCondition(
      guideAvgScores,
      cursor,
      options,
    );
    const orderBy = this.buildOrderBy(options);

    const guides: GuideProfile[] =
      await this.prismaService.guideProfile.findMany({
        where: whereCondition,
        take: limit,
        orderBy: orderBy,
        include: {
          member: {
            include: {
              languages: {
                select: {
                  language: true,
                },
              },
              tags: {
                select: {
                  tag: true,
                },
              },
            },
          },
          areas: {
            select: {
              area: true,
            },
          },
          languageCertifications: {
            select: {
              languageCertification: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

    const result = this.enrichGuides(guides, {
      guidesWithMatchingAvgScores: guideAvgScores,
    });

    return result;
  }

  private enrichGuides(
    guides: GuideProfile[],
    additional: {
      guidesWithMatchingAvgScores?: GuideWithMatchingAvgScore[];
    },
  ) {
    const { guidesWithMatchingAvgScores } = additional;

    return guides.map((guide) => {
      const matchingScore = guidesWithMatchingAvgScores?.find(
        (score) => score.guideId === guide.id,
      );

      return {
        ...guide,
        avgCommunicationScore: matchingScore?.avgCommunicationScore || 0,
        avgKindnessScore: matchingScore?.avgKindnessScore || 0,
        avgLocationScore: matchingScore?.avgLocationScore || 0,
        totalAvgScore: matchingScore?.totalAvgScore || 0,
      };
    });
  }

  private buildOrderBy({
    orderBy,
    sort,
  }: Pick<
    GuidePaginationOptions,
    'orderBy' | 'sort'
  >): Prisma.GuideProfileOrderByWithRelationInput {
    if (!orderBy) {
      return { id: 'desc' };
    }

    if (orderBy === 'guideCount') {
      return {
        reviews: { _count: sort },
      };
    }

    if (orderBy === 'temperature') {
      return { temperature: sort };
    }
  }

  private buildWhereCondition(
    matchingAvgScores: GuideWithMatchingAvgScore[],
    cursor?: number,
    options?: GuidePaginationOptions,
  ): Prisma.GuideProfileWhereInput {
    const {
      areas,
      age,
      gender,
      guideCount,
      languageCertifications,
      languages,
      score,
      temperature,
      followerId,
    } = options;

    const whereCondition: Prisma.GuideProfileWhereInput = {
      member: {
        role: Role.GUIDE,
      },
    };

    if (matchingAvgScores) {
      whereCondition.AND = {
        id: {
          in: matchingAvgScores.map((score) => score.guideId),
        },
      };
    }

    if (cursor) {
      whereCondition.id = { lt: cursor };
    }

    if (gender) {
      whereCondition.member.gender = options.gender;
    }

    if (age) {
      const { start, end } = DateHelpers.calculateBirthdateRange(
        age.min,
        age.max,
      );
      whereCondition.member.birthdate = {
        gte: start,
        lte: end,
      };
    }

    if (temperature) {
      whereCondition.temperature = {
        gte: temperature.min,
        lte: temperature.max,
      };
    }

    if (areas) {
      whereCondition.areas = {
        some: {
          areaId: { in: areas },
        },
      };
    }

    if (languages) {
      whereCondition.member.languages = {
        some: {
          languageId: { in: languages },
        },
      };
    }

    if (languageCertifications) {
      whereCondition.languageCertifications = {
        some: {
          languageCertificationId: { in: languageCertifications },
        },
      };
    }

    if (followerId) {
      whereCondition.member.followings = {
        some: {
          followerId,
        },
      };
    }

    return whereCondition;
  }

  async getGuidesWithMatchingAvgScores(
    scores: number[],
  ): Promise<GuideWithMatchingAvgScore[]> {
    if (!scores || scores.length === 0) scores = [0, 1, 2, 3, 4, 5];

    return this.prismaService.$queryRaw`
      SELECT
        g."id" AS "guideId",
        COALESCE(ROUND(AVG(r."communicationScore"), 1), 0) AS "avgCommunicationScore",
        COALESCE(ROUND(AVG(r."kindnessScore"), 1), 0) AS "avgKindnessScore",
        COALESCE(ROUND(AVG(r."locationScore"), 1), 0) AS "avgLocationScore",
        COALESCE(ROUND((AVG(r."communicationScore") + AVG(r."kindnessScore") + AVG(r."locationScore")) / 3, 1), 0) AS "totalAvgScore"
      FROM
        Public."GuideProfile" as g
      LEFT JOIN
        Public."GuideReview" as r
      ON
        g."id" = r."guideId"
      GROUP BY
        g."id"
      HAVING
        CASE WHEN ARRAY_LENGTH(${scores}, 1) > 0 THEN
          ROUND((COALESCE(AVG(r."communicationScore"), 0) + COALESCE(AVG(r."kindnessScore"), 0) + COALESCE(AVG(r."locationScore"), 0)) / 3, 0) = ANY(${scores})
        ELSE
          TRUE
        END
    `;
  }

  /**
   * 특정 가이드 정보를 조회합니다.
   * @param id - 가이드의 고유 식별자
   */
  async findOne(id: number) {
    const guide = await this.prismaService.member.findUnique({
      where: { id, role: Role.GUIDE },
      include: {
        guideProfile: {
          include: {
            areas: {
              select: { area: true },
            },
            languageCertifications: {
              select: {
                languageCertification: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        languages: {
          select: {
            language: true,
          },
        },
        tags: { include: { tag: { select: { id: true, name: true } } } },
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

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    return this.prismaService.guideProfile.update({
      where: { id },
      data: updateProfileDto,
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

  async getGuideReviewsWithPagination(
    cursor?: number,
    limit = 10,
    options?: GuideReviewPaginationOptions,
  ) {
    const { reviewerId, guideId } = options;
    const whereCondition: Prisma.GuideReviewWhereInput = {};

    if (cursor) {
      whereCondition.id = { lt: cursor };
    }

    if (reviewerId) {
      whereCondition.reviewerId = reviewerId;
    }

    if (guideId) {
      whereCondition.guideId = guideId;
    }

    return this.prismaService.guideReview.findMany({
      where: whereCondition,
      take: limit,
      orderBy: { id: 'desc' },
      include: {
        guide: {
          include: { member: true },
        },
      },
    });
  }

  async createReview(
    guideId: number,
    reviewerId: number,
    createReviewDto: CreateReviewDto,
  ) {
    return this.prismaService.guideReview.create({
      data: {
        guideId,
        reviewerId,
        ...createReviewDto,
      },
    });
  }

  findReview(reviewId: number) {
    return this.prismaService.guideReview.findUnique({
      where: { id: reviewId },
    });
  }

  updateReview(reviewId: number, updateReviewDto: UpdateReviewDto) {
    this.prismaService.guideReview.update({
      where: { id: reviewId },
      data: updateReviewDto,
    });
  }

  deleteReview(reviewId: number) {
    return this.prismaService.guideReview.delete({
      where: { id: reviewId },
    });
  }

  getServices(guideId: number) {
    return this.prismaService.service.findMany({
      where: { guideId },
    });
  }
}
