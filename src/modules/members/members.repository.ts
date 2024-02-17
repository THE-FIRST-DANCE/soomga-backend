import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Prisma } from '@prisma/client';

@Injectable()
export class MembersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.member.findMany({});
  }

  async findOne(id: number) {
    return this.prismaService.member.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.MemberCreateInput) {
    return this.prismaService.member.create({
      data,
    });
  }

  async update(id: number, data: Prisma.MemberUpdateInput) {
    return this.prismaService.member.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prismaService.member.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.member.findUnique({
      where: { email },
    });
  }

  async findByProvider(provider: $Enums.Provider, providerId: string) {
    return this.prismaService.member.findMany({
      where: {
        AND: [{ provider }, { providerId }],
      },
    });
  }

  async updateLanguages(id: number, languageIds: number[]) {
    const currentLanguageIds = await this.prismaService.memberLanguage
      .findMany({
        where: { memberId: id },
        select: {
          languageId: true,
        },
      })
      .then((result) => result.map(({ languageId }) => languageId));
    const languageIdsToCreate = languageIds.filter(
      (id) => !currentLanguageIds.includes(id),
    );
    const languageIdsToDelete = currentLanguageIds.filter(
      (id) => !languageIds.includes(id),
    );

    if (languageIdsToCreate.length === 0 && languageIdsToDelete.length === 0) {
      return;
    }

    return await this.prismaService.member.update({
      where: { id },
      data: {
        languages: {
          deleteMany: {
            languageId: { in: languageIdsToDelete },
          },
          createMany: {
            data: languageIdsToCreate.map((languageId) => ({
              languageId,
            })),
            skipDuplicates: true,
          },
        },
      },
    });
  }
}
