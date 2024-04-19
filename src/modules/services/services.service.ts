import { ForbiddenException, Injectable } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { UpdateServiceDto } from './dto/update-service.dto';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { CreateServiceDto } from './dto/create-services.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  create(guideId: number, createServiceDto: CreateServiceDto) {
    return this.servicesRepository.create(guideId, createServiceDto);
  }

  findOne(id: number) {
    return this.servicesRepository.findOne(id);
  }

  findAll() {
    return this.servicesRepository.findAll();
  }

  async update(
    serviceId: number,
    guideId: number,
    updateServiceDto: UpdateServiceDto,
  ) {
    await this.validateOwnershipService(guideId, serviceId);
    return this.servicesRepository.update(serviceId, updateServiceDto);
  }

  async validateOwnershipService(guideId: number, serviceId: number) {
    const service = await this.servicesRepository.findOne(serviceId);

    if (!service) {
      throw new ForbiddenException(ErrorMessage.NOTFOUND_SERVICE);
    }
    if (service.guideId !== guideId) {
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
    }
  }
}
