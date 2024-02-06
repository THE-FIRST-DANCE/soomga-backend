import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { MembersRepository } from './members.repository';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';

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

  async findMemberByEmail(email: string) {
    return this.membersRepository.findByEmail(email);
  }

  async findMemberByNickname(nickname: string) {
    return this.membersRepository.findByNickname(nickname);
  }

  async checkValidEmail(email: string) {
    const member = await this.membersRepository.findByEmail(email);
    if (member) {
      throw new ConflictException(ErrorMessage.EMAIL_EXISTS);
    }
    return true;
  }

  async checkValidNickname(nickname: string) {
    const member = await this.membersRepository.findByNickname(nickname);
    if (member) {
      throw new ConflictException(ErrorMessage.NICKNAME_EXISTS);
    }
    return true;
  }
}
