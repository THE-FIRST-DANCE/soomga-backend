import { PartialType } from '@nestjs/swagger';
import { CreateSOSDto } from './create-sos.dto';

export class UpdateSOSDto extends PartialType(CreateSOSDto) {}
