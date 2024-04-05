import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  transform(value: string): number[] {
    if (!value) return [];
    return Array.isArray(value)
      ? value.map((val) => parseInt(val, 10))
      : [parseInt(value, 10)];
  }
}
