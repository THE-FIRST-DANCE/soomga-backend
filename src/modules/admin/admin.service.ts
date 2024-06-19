import { Injectable } from '@nestjs/common';
import { MembersRepository } from '../members/members.repository';
import { GuidesRepository } from '../guides/guides.repository';
import { DeleteMembersDto, DeleteType } from './dto/delete-members.dto';
import { DeactivateMembersDto } from './dto/deactivate-members.dto';
import { ActivateMembersDto } from './dto/activate-members.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly memberRepository: MembersRepository,
    private readonly guidesRepository: GuidesRepository,
  ) {}

  async deactivateMembers(activeMembersDto: ActivateMembersDto) {
    const { ids } = activeMembersDto;
    return this.memberRepository.inactiveMembers(ids);
  }

  async activateMembers(inactiveMembersDto: DeactivateMembersDto) {
    const { ids } = inactiveMembersDto;
    return this.memberRepository.activeMembers(ids);
  }

  async deleteMembers(deleteMembersDto: DeleteMembersDto) {
    const { type, ids } = deleteMembersDto;
    if (type === DeleteType.HARD) {
      return this.memberRepository.hardDeleteMembers(ids);
    } else {
      return this.memberRepository.softDeleteMembers(ids);
    }
  }
}
