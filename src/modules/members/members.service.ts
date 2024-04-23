import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { MembersRepository } from './members.repository';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { Provider } from '@prisma/client';

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async findAll() {
    return this.membersRepository.findAll();
  }

  async findOne(id: number) {
    return this.membersRepository.findOne(id);
  }

  async create(createMemberDto: CreateMemberDto) {
    const hashedPassword = await AuthHelpers.hash(createMemberDto.password);
    const newMember: CreateMemberDto = {
      ...createMemberDto,
      password: hashedPassword,
    };

    return this.membersRepository.create(newMember);
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    return this.membersRepository.update(id, updateMemberDto);
  }

  async remove(id: number) {
    return this.membersRepository.remove(id);
  }

  async findByEmail(email: string) {
    return this.membersRepository.findByEmail(email);
  }

  async checkValidEmail(email: string) {
    const member = await this.membersRepository.findByEmail(email);
    if (member) {
      throw new ConflictException(ErrorMessage.EMAIL_EXISTS);
    }
    return true;
  }

  async findByProvider(provider: Provider, providerId: string) {
    return this.membersRepository.findByProvider(provider, providerId);
  }

  async updateLanguages(id: number, languageIds: number[]) {
    return this.membersRepository.updateLanguages(id, languageIds);
  }

  async leave(id: number) {
    return this.membersRepository.leave(id);
  }

  async comeback(id: number) {
    return this.membersRepository.comeback(id);
  }

  async followToggle(followingId: number, followerId: number) {
    const isFollowing = await this.membersRepository.isFollowing(
      followingId,
      followerId,
    );

    if (isFollowing) {
      await this.membersRepository.unfollow(followingId, followerId);
    } else {
      await this.membersRepository.follow(followingId, followerId);
    }

    return !isFollowing;
  }

  findByPhoneNumber(phoneNumber: string) {
    return this.membersRepository.findByPhoneNumber(phoneNumber);
  }

  getReservations(id: number) {
    return this.membersRepository.getReservations(id);
  }
}
