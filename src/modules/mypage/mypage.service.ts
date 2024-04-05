import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MyPageRepository } from './mypage.repository';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthHelpers } from 'src/shared/helpers/auth.helpers';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { MembersRepository } from '../members/members.repository';
import { UpdateEmailDto } from './dto/update-email.dto';
import { AuthRepository } from '../auth/auth.repository';
import { PlansRepository } from '../plans/plans.repository';
import { GuidesRepository } from '../guides/guides.repository';
import { createPageResponse } from 'src/shared/pagination/pagination.utils';
import { GuideReviewPaginationOptions } from '../guides/guides.interface';

@Injectable()
export class MyPageService {
  constructor(
    private readonly myPageRepository: MyPageRepository,
    private readonly membersRepository: MembersRepository,
    private readonly authRepository: AuthRepository,
    private readonly plansRepository: PlansRepository,
    private readonly guidesRepository: GuidesRepository,
  ) {}
  async findOne(id: number) {
    const member = await this.membersRepository.findOne(id);
    if (!member) {
      throw new NotFoundException(ErrorMessage.NOT_REGISTERED);
    }
    const { password, ...result } = member;

    return result;
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const member = await this.membersRepository.findOne(id);
    if (
      !member ||
      !(await AuthHelpers.verify(updatePasswordDto.password, member.password))
    ) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const hashedPassword = await AuthHelpers.hash(
      updatePasswordDto.newPassword,
    );

    return this.myPageRepository.updatePassword(id, hashedPassword);
  }

  async updateNickname(id: number, updateNicknameDto: UpdateNicknameDto) {
    const member = await this.membersRepository.findOne(id);

    if (!member) {
      throw new NotFoundException(ErrorMessage.NOT_REGISTERED);
    }

    return this.myPageRepository.updateNickname(id, updateNicknameDto.nickname);
  }

  // TODO:
  async updateEmail(id: number, updateEmailDto: UpdateEmailDto) {
    const member = await this.membersRepository.findOne(id);

    if (!member) {
      throw new NotFoundException(ErrorMessage.NOT_REGISTERED);
    }
    // TODO: email 중복 체크
    const isEmailExists = await this.membersRepository.findByEmail(
      updateEmailDto.email,
    );
    if (isEmailExists) {
      throw new UnauthorizedException(ErrorMessage.EMAIL_EXISTS);
    }

    // const currentAuthCode = await this.authRepository.getEmailAuthCode(id);
    return this.myPageRepository.updateEmail(id, updateEmailDto.email);
  }

  async findPlans(id: number) {
    const plans = await this.plansRepository.getPlanByUserId(id);
    return plans;
  }

  async getMyGuideReviews(id: number, cursor: number, limit: number) {
    const options: GuideReviewPaginationOptions = {
      reviewerId: id,
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
}
