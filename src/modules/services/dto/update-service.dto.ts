import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-services.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
