import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceDto } from './dto/create-services.dto';

@Injectable()
export class ServicesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(guideId: number, createServiceDto: CreateServiceDto) {
    return this.prismaService.service.create({
      data: {
        guideId,
        ...createServiceDto,
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.service.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.prismaService.service.findMany();
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return this.prismaService.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }
}
