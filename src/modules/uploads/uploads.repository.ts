import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async fileUpload(fileName: string, url: string) {
    return this.prismaService.file.create({
      data: {
        name: fileName,
        url,
      },
    });
  }
}
