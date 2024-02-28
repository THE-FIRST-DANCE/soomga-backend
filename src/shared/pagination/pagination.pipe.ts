import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntWithDefaultPipe implements PipeTransform {
  transform(value: string | undefined) {
    if (!value) {
      return value;
    }

    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`Invalid number: ${value}`);
    }
    return val;
  }
}

@Injectable()
export class ParseRangePipe implements PipeTransform {
  transform(value: string | undefined) {
    if (!value) {
      return value;
    }

    const [min, max] = value.split('-').map(Number);
    if (isNaN(min) || isNaN(max)) {
      throw new BadRequestException(`Invalid number: ${value}`);
    }

    return { min, max };
  }
}

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  transform(value: string | undefined) {
    if (!value) {
      return value;
    }
    return value.split(' ').map(Number);
  }
}
