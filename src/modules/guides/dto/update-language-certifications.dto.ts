import { PickType } from '@nestjs/swagger';
import { RegisterGuideDto } from './register-guide.dto';

export class UpdateLanguageCertificationsDto extends PickType(
  RegisterGuideDto,
  ['languageCertificationIds'],
) {}
