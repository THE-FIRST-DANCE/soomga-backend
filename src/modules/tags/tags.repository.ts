import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTag(name: string) {
    return this.prisma.tag.create({
      data: {
        name,
      },
    });
  }

  async findTag(name: string) {
    return this.prisma.tag.findUnique({
      where: {
        name,
      },
    });
  }

  async findAll() {
    return this.prisma.tag.findMany();
  }

  async findTagsByIds(ids: number[]) {
    return this.prisma.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findTagsByNames(names: string[]) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          in: names,
        },
      },
    });
  }

  async findOrCreateTag(name: string) {
    const tag = await this.findTag(name);
    if (tag) {
      return tag;
    }
    return this.createTag(name);
  }

  async findOrCreateTags(names: string[]) {
    await this.prisma.tag.createMany({
      data: names.map((name) => ({ name })),
      skipDuplicates: true,
    });

    const allTags = await this.findTagsByNames(names);

    return allTags;
  }
}
