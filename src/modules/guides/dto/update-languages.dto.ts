import { PickType } from '@nestjs/swagger';
import { RegisterGuideDto } from './register-guide.dto';

export class UpdateLanguagesDto extends PickType(RegisterGuideDto, [
  'languageIds',
]) {}
