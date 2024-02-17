import { PickType } from '@nestjs/swagger';
import { RegisterGuideDto } from './register-guide.dto';

export class UpdateAreasDto extends PickType(RegisterGuideDto, ['areaIds']) {}
