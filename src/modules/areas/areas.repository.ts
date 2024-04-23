import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreasRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.area.findMany({});
  }
}
