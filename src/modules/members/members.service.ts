import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import ErrorMessage from '../../shared/constants/error-messages.constants';

@Injectable()
export class MembersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.member.findMany({});
  }

  async findOne(id: number) {
    return this.prismaService.member.findUnique({
      where: { id },
    });
  }

  async create(createMemberDto: CreateMemberDto) {
    return this.prismaService.member.create({
      data: createMemberDto,
    });
  }

  async update(id: number, data: any) {
    return this.prismaService.member.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prismaService.member.delete({
      where: { id },
    });
  }

  async findMemberByEmail(email: string) {
    return this.prismaService.member.findUnique({
      where: { email },
    });
  }

  async findMemberByNickname(nickname: string) {
    return this.prismaService.member.findUnique({
      where: { nickname },
    });
  }

  async checkValidEmail(email: string) {
    const member = await this.findMemberByEmail(email);
    if (member) {
      throw new ConflictException(ErrorMessage.EMAIL_EXISTS);
    }
    return true;
  }

  async checkValidNickname(nickname: string) {
    const member = await this.findMemberByNickname(nickname);
    if (member) {
      throw new ConflictException(ErrorMessage.NICKNAME_EXISTS);
    }
    return true;
  }
}
