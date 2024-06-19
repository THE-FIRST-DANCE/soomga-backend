import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuidesRepository } from './guides.repository';
import { RegisterGuideDto } from './dto/register-guide.dto';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { createPageResponse } from '../../shared/pagination/pagination.utils';
import {
  GuidePaginationOptions,
  GuideReviewPaginationOptions,
} from './guides.interface';

import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PersonalizeService } from '../personalize/personalize.service';

@Injectable()
export class GuidesService {
  constructor(private readonly guidesRepository: GuidesRepository) {}

  async findAll() {
    return this.guidesRepository.findAll();
  }

  async paginate(
    cursor: number | null,
    limit: number,
    options?: GuidePaginationOptions,
  ) {
    const guides = await this.guidesRepository.paginate(cursor, limit, options);

    const response = createPageResponse(
      guides,
      { cursor, limit },
      guides.length,
    );

    return response;
  }

  async findOne(id: number) {
    return this.guidesRepository.findOne(id);
  }

  async registerGuide(id: number, registerGuideDto: RegisterGuideDto) {
    return this.guidesRepository.registerGuide(id, registerGuideDto);
  }

  async updateAreas(id: number, areaIds: number[]) {
    return this.guidesRepository.updateAreas(id, areaIds);
  }

  async updateLanguageCertifications(
    id: number,
    languageCertificationIds: number[],
  ) {
    return this.guidesRepository.updateLanguageCertifications(
      id,
      languageCertificationIds,
    );
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    return this.guidesRepository.updateProfile(id, updateProfileDto);
  }

  async leaveGuide(id: number) {
    return this.guidesRepository.leaveGuide(id);
  }

  async paginateReviews(
    cursor: number | null,
    limit: number,
    options?: GuideReviewPaginationOptions,
  ) {
    const reviews = await this.guidesRepository.getGuideReviewsWithPagination(
      cursor,
      limit,
      options,
    );

    const response = createPageResponse(
      reviews,
      { cursor, limit },
      reviews.length,
    );

    return response;
  }

  async getReviews(guideId: number, cursor: number, limit: number) {
    const options: GuideReviewPaginationOptions = {
      guideId,
    };

    const reviews = await this.guidesRepository.getGuideReviewsWithPagination(
      cursor,
      limit,
      options,
    );

    const response = createPageResponse(
      reviews,
      { cursor, limit },
      reviews.length,
    );

    return response;
  }

  createReview(
    guideId: number,
    reviewerId: number,
    createReviewDto: CreateReviewDto,
  ) {
    return this.guidesRepository.createReview(
      guideId,
      reviewerId,
      createReviewDto,
    );
  }

  async updateReview(
    reviewId: number,
    reviewerId: number,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.guidesRepository.findReview(reviewId);

    if (!review) {
      throw new NotFoundException(ErrorMessage.NOTFOUND_REVIEW);
    }

    if (review.reviewerId !== reviewerId) {
      throw new BadRequestException(ErrorMessage.PERMISSION_DENIED);
    }

    return this.guidesRepository.updateReview(reviewId, updateReviewDto);
  }

  async deleteReview(reviewId: number, reviewerId: number) {
    const review = await this.guidesRepository.findReview(reviewId);

    if (!review) {
      throw new NotFoundException(ErrorMessage.NOTFOUND_REVIEW);
    }

    if (review.reviewerId !== reviewerId) {
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
    }

    return this.guidesRepository.deleteReview(reviewId);
  }

  getServices(guideId: number) {
    return this.guidesRepository.getServices(guideId);
  }

  getReservations(guideId: number) {
    return this.guidesRepository.getReservations(guideId);
  }

  count(options?: GuidePaginationOptions) {
    return this.guidesRepository.countGuides(options);
  }

  getGuidesByIds(ids: number[]) {
    return this.guidesRepository.getGuides(ids);
  }
}
