import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { GuideOrderBy, GuideSort } from './guides.interface';

export function GuidePagination() {
  return applyDecorators(
    ApiQuery({
      name: 'gender',
      required: false,
    }),
    ApiQuery({
      name: 'age',
      type: 'string',
      example: '10-80',
      required: false,
    }),
    ApiQuery({
      name: 'guideCount',
      type: 'string',
      example: '0-99',
      required: false,
    }),
    ApiQuery({
      name: 'temperature',
      type: 'string',
      example: '0-99',
      required: false,
    }),
    ApiQuery({
      name: 'areas',
      type: 'string',
      example: '1,2',
      required: false,
    }),
    ApiQuery({
      name: 'languages',
      type: 'string',
      example: '1,2',
      required: false,
    }),
    ApiQuery({
      name: 'languageCertifications',
      type: 'string',
      example: '1,2',
      required: false,
    }),
    ApiQuery({
      name: 'score',
      type: 'string',
      example: '0,1',
      required: false,
    }),
    ApiQuery({
      name: 'orderBy',
      type: 'string',
      enum: GuideOrderBy,
      example: GuideOrderBy.TEMPERATURE,
      required: false,
    }),
    ApiQuery({
      name: 'sort',
      type: 'string',
      enum: GuideSort,
      example: GuideSort.DESC,
      required: false,
    }),
  );
}
