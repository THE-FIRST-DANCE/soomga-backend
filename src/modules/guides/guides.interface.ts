import { Gender, Member } from '@prisma/client';

export interface GuidePaginationOptions {
  gender?: Gender; // 'male', 'female'
  age?: { min: number; max: number }; // '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99'
  guideCount?: { min: number; max: number }; // '1-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99'
  temperature?: { min: number; max: number }; // '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99'
  areas?: number[]; // '1 2 3 4 5', '1 2 3 4', '1 2 3', '1 2', '1'
  languages?: number[]; // '1 2 3 4 5', '1 2 3 4', '1 2 3', '1 2', '1'
  languageCertifications?: number[]; // '1 2 3 4 5', '1 2 3 4', '1 2 3', '1 2', '1'
  score?: number[]; // '0 1 2 3 4 5', '0 1 2 3 4', '0 1 2 3', '0 1 2', '0 1'
  orderBy?: GuideOrderBy;
  sort?: GuideSort;
  followerId?: number;
}

export interface GuideReviewPaginationOptions {
  reviewerId?: number;
  guideId?: number;
}

export enum GuideOrderBy {
  TEMPERATURE = 'temperature',
  GUIDE_COUNT = 'guideCount',
}

export enum GuideSort {
  ASC = 'asc',
  DESC = 'desc',
}

export interface GuideWithMatchingAvgScore {
  guideId: number;
  avgCommunicationScore: number;
  avgKindnessScore: number;
  avgLocationScore: number;
  totalAvgScore: number;
}
