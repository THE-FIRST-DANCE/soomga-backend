import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { RegisterGuideDto } from './dto/register-guide.dto';
import { MembersRepository } from '../members/members.repository';

@Injectable()
export class GuidesRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly membersRepository: MembersRepository,
  ) {}

  async findAll() {
    return this.prismaService.member.findMany({
      where: { role: Role.GUIDE },
    });
  }

  async paginate(page: number, perPage: number) {
    return this.prismaService.member.findMany({
      where: { role: Role.GUIDE },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        _count: {
          select: { boards: true },
        },
      },
    });
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
              memberId: id,
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
        where: { guide: { memberId: id } },
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
      where: { memberId: id },
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
            guide: { memberId: id },
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
      where: { memberId: id },
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

  /**
   * 가이드에서 탈퇴하고, 멤버의 역할을 USER로 업데이트합니다.
   * @param id - 제거할 가이드의 ID.
   */
  async leaveGuide(id: number) {
    return this.prismaService.$transaction([
      this.prismaService.guideProfile.delete({
        where: { memberId: id },
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
      where: { memberId: id },
      data: { phoneNumber },
    });
  }
}
