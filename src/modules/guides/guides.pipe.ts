import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Gender } from '@prisma/client';

@Injectable()
export class ParseGenderPipe implements PipeTransform {
  transform(value: string | undefined) {
    if (!value) {
      return value;
    }

    value = value.toUpperCase();

    switch (value) {
      case 'MALE':
      case 'FEMALE':
        return Gender[value];
      default:
        throw new BadRequestException('Invalid gender');
    }
  }
}
