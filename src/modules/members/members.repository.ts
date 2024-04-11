import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberStatus, Prisma, Provider } from '@prisma/client';

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

  async findByProvider(provider: Provider, providerId: string) {
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

    return this.prismaService.member.update({
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

  async updateTags(id: number, tagIds: number[]) {
    const currentTagIds = await this.prismaService.memberTag
      .findMany({
        where: { memberId: id },
      })
      .then((result) => result.map(({ tagId }) => tagId));
    const tagIdsToCreate = tagIds.filter((id) => !currentTagIds.includes(id));
    const tagIdsToDelete = currentTagIds.filter((id) => !tagIds.includes(id));

    if (tagIdsToCreate.length === 0 && tagIdsToDelete.length === 0) {
      return;
    }

    return this.prismaService.member.update({
      where: { id },
      data: {
        tags: {
          deleteMany: {
            tagId: { in: tagIdsToDelete },
          },
          createMany: {
            data: tagIdsToCreate.map((tagId) => ({ tagId })),
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async leave(id: number) {
    return this.prismaService.member.update({
      where: { id },
      data: {
        status: MemberStatus.DELETED,
        deletedAt: new Date(),
      },
    });
  }

  async inactiveMembers(ids: number[]) {
    return this.prismaService.member.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: MemberStatus.INACTIVE,
      },
    });
  }

  async activeMembers(ids: number[]) {
    return this.prismaService.member.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: MemberStatus.ACTIVE,
      },
    });
  }

  async softDeleteMembers(ids: number[]) {
    return this.prismaService.member.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: MemberStatus.DELETED,
        deletedAt: new Date(),
      },
    });
  }

  async hardDeleteMembers(ids: number[]) {
    return this.prismaService.member.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async comeback(id: number) {
    return this.prismaService.member.update({
      where: { id },
      data: {
        status: MemberStatus.ACTIVE,
        deletedAt: null,
      },
    });
  }

  async isFollowing(followingId: number, followerId: number) {
    return this.prismaService.follow.findUnique({
      where: {
        followerId_followingId: {
          followingId,
          followerId,
        },
      },
    });
  }

  async follow(followingId: number, followerId: number) {
    return this.prismaService.follow.create({
      data: {
        followingId,
        followerId,
      },
    });
  }

  async unfollow(followingId: number, followerId: number) {
    return this.prismaService.follow.delete({
      where: {
        followerId_followingId: {
          followingId,
          followerId,
        },
      },
    });
  }
  findByPhoneNumber(phoneNumber: string) {
    return this.prismaService.member.findUnique({
      where: { phoneNumber },
    });
  }
}
