import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.member.findMany({});
  }

  async findOne(id: number) {
    return this.prismaService.member.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prismaService.member.create({
      data,
    });
  }

  async update(id: number, data: any) {
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
}
