import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Prisma } from '@prisma/client';

// 나중에 적용할 예정
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
}
