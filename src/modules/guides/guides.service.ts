import { BadRequestException, Injectable } from '@nestjs/common';
import { GuidesRepository } from './guides.repository';
import { RegisterGuideDto } from './dto/register-guide.dto';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GuidesService {
  constructor(
    private readonly guidesRepository: GuidesRepository,
    private readonly authService: AuthService,
  ) {}

  async findOne(id: number) {
    return this.guidesRepository.findOne(id);
  }

  async registerGuide(id: number, registerGuideDto: RegisterGuideDto) {
    return this.guidesRepository.registerGuide(id, registerGuideDto);
  }

  async updateAreas(id: number, areaIds: number[]) {
    return this.guidesRepository.updateAreas(id, areaIds);
  }

  async updateLanguageCertifications(
    id: number,
    languageCertificationIds: number[],
  ) {
    return this.guidesRepository.updateLanguageCertifications(
      id,
      languageCertificationIds,
    );
  }

  async leaveGuide(id: number) {
    return this.guidesRepository.leaveGuide(id);
  }
}
