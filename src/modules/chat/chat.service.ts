import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { createPageResponse } from '../../shared/pagination/pagination.utils';
import { Cache } from 'cache-manager';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async getRoomList(id: number) {
    return this.chatRepository.getRoomList(id);
  }

  async getRoom(roomId: string) {
    return this.chatRepository.getRoom(roomId);
  }

  async createRoom(organizerId: number, createRoomDto: CreateRoomDto) {
    return this.chatRepository.createRoom(
      organizerId,
      createRoomDto.participants,
    );
  }

  async getMessages(roomId: string, cursor?: number, limit?: number) {
    const messages = await this.chatRepository.getMessages(
      roomId,
      cursor,
      limit,
    );

    const response = createPageResponse(
      messages,
      { cursor, limit },
      messages.length,
    );

    return response;
  }

  async storeMessages(roomId: string) {
    return this.chatRepository.storeMessages(roomId);
  }

  async leaveRoom(roomId: string, memberId: number) {
    return this.chatRepository.leaveRoom(roomId, memberId);
  }

  async inviteMember(
    id: number,
    roomId: string,
    inviteMemberDto: InviteMemberDto,
  ) {
    return this.chatRepository.inviteMember(
      id,
      roomId,
      inviteMemberDto.participants,
    );
  }

  async deleteRoom(roomId: string) {
    return this.chatRepository.deleteRoom(roomId);
  }
}
