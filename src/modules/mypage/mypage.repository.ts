import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MyPageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async updatePassword(id: number, newPassword: string) {
    return this.prismaService.member.update({
      where: { id },
      data: {
        password: newPassword,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        birthdate: true,
        gender: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        provider: true,
        providerId: true,
      },
    });
  }

  async updateNickname(id: number, nickname: string) {
    return this.prismaService.member.update({
      where: { id },
      data: {
        nickname,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        birthdate: true,
        gender: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        provider: true,
        providerId: true,
      },
    });
  }

  async updateEmail(id: number, email: string) {
    return this.prismaService.member.update({
      where: { id },
      data: {
        email,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        birthdate: true,
        gender: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        provider: true,
        providerId: true,
      },
    });
  }
}
