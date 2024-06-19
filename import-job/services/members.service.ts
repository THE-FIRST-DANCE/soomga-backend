import { PrismaClient, Role } from '@prisma/client';
import { GuideDS, MemberDS } from 'import-job/interfaces/member';
import moment from 'moment';

export class MembersService {
  constructor(private readonly prisma: PrismaClient) {}

  async getMembers(): Promise<MemberDS[]> {
    const members = await this.prisma.member.findMany({
      select: {
        id: true,
        birthdate: true,
        gender: true,
        languages: {
          select: {
            languageId: true,
          },
        },
      },
    });

    return members.map((member) => ({
      USER_ID: member.id,
      AGE: moment().diff(member.birthdate, 'years'),
      GENDER: member.gender,
      LANG_KO: member.languages.some((language) => language.languageId === 0),
      LANG_EN: member.languages.some((language) => language.languageId === 1),
      LANG_JA: member.languages.some((language) => language.languageId === 2),
    }));
  }

  async getGuides(): Promise<GuideDS[]> {
    const guides = await this.prisma.member.findMany({
      where: { role: Role.GUIDE },
      select: {
        id: true,
        birthdate: true,
        gender: true,
        languages: {
          select: {
            languageId: true,
          },
        },
      },
    });

    return guides.map((guide) => ({
      ITEM_ID: guide.id,
      AGE: moment().diff(guide.birthdate, 'years'),
      GENDER: guide.gender,
      LANG_KO: guide.languages.some((language) => language.languageId === 0),
      LANG_EN: guide.languages.some((language) => language.languageId === 1),
      LANG_JA: guide.languages.some((language) => language.languageId === 2),
    }));
  }

  async getInteractions() {}
}
