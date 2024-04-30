import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { createPageResponse } from '../../shared/pagination/pagination.utils';
import { Cache } from 'cache-manager';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { Reservation } from '@prisma/client';
import { Content, Message } from 'src/interfaces/chat.interface';
import ChatGateway from './chat.gateway';
import { NestConfig } from 'src/configs/config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  nest: NestConfig;
  constructor(
    private readonly chatRepository: ChatRepository,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    // @Inject('IO_SERVER') private readonly ioServer: Server,
    private readonly chatGateway: ChatGateway,
    private readonly configService: ConfigService,
  ) {
    this.nest = this.configService.get<NestConfig>('nest');
  }

  async getRoomList(id: number) {
    return this.chatRepository.getRoomList(id);
  }

  async getRoom(roomId: string) {
    const room = await this.chatRepository.getRoom(roomId);

    if (!room) {
      throw new NotFoundException(ErrorMessage.NOTFOUND_ROOM);
    }

    return room;
  }

  async updateRoom(
    roomId: string,
    memberId: number,
    updateRoomDto: UpdateRoomDto,
  ) {
    await this.verifyRoomMember(roomId, memberId);
    return this.chatRepository.updateRoom(roomId, updateRoomDto);
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

  async verifyRoomMember(roomId: string, memberId: number) {
    const room = await this.chatRepository.getRoom(roomId);

    const isParticipant = room.members.some(
      (member) => member.memberId === memberId,
    );

    if (!isParticipant) {
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
    }
  }

  async sendReservation(roomId: string, reservation: Reservation) {
    let lastMessageIndex =
      await this.chatRepository.getLastMessageIndex(roomId);

    const message: Message = {
      id: ++lastMessageIndex,
      content: {
        message: '새로운 예약이 생성되었습니다.',
        extra: {
          type: 'reservation',
          data: reservation,
        },
      },
      sender: {
        id: 0,
        nickname: this.nest.name,
        avatar:
          'https://soomga-s3.s3.ap-northeast-2.amazonaws.com/public/img/logo_mobile.svg',
      },
      createdAt: new Date(),
    };

    await this.chatRepository.cacheMessage(roomId, message);
    await this.chatRepository.setLastMessageIndex(roomId, lastMessageIndex);

    this.chatGateway.server.to(roomId).emit('newMessage', message);
  }

  async updateReservation(roomId: string, reservation: Reservation) {
    this.chatRepository.updateReservationMessage(roomId, reservation);
  }

  async justSendReservation(roomId: string, reservation: Reservation) {
    let lastMessageIndex =
      await this.chatRepository.getLastMessageIndex(roomId);

    const message: Message = {
      id: ++lastMessageIndex,
      content: {
        message: '새로운 예약이 생성되었습니다.',
        extra: {
          type: 'reservation',
          data: reservation,
        },
      },
      sender: {
        id: 0,
        nickname: this.nest.name,
        avatar:
          'https://soomga-s3.s3.ap-northeast-2.amazonaws.com/public/img/logo_mobile.svg',
      },
      createdAt: new Date(),
    };

    this.chatGateway.server.to(roomId).emit('newMessage', message);
  }
}
