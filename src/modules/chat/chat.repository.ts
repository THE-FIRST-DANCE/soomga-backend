import { Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { Content, Message } from '../../interfaces/chat.interface';
import { ConfigService } from '@nestjs/config';
import { CacheConfig } from '../../configs/config.interface';
import { UpdateRoomDto } from './dto/update-room.dto';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { Reservation } from '@prisma/client';

export class ChatRepository {
  cacheConfig: CacheConfig;
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.cacheConfig = this.configService.get<CacheConfig>('cache');
  }

  async getRoomList(id: number) {
    const rooms = await this.prismaService.chatroom.findMany({
      where: {
        members: {
          some: {
            memberId: id,
          },
        },
      },
      include: {
        members: {
          select: {
            member: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // 1:1 채팅방의 이름을 상대방 닉네임으로 변경
    rooms.map((room) => {
      if (room.members.length === 2) {
        const other = room.members.find((member) => member.member.id !== id);
        room.name = other.member.nickname;
      }
    });

    return rooms;
  }

  async getRoom(id: string) {
    return this.prismaService.chatroom.findUnique({
      where: {
        id,
      },
      include: { members: true },
    });
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prismaService.chatroom.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async createRoom(organizerId: number, participants: number[]) {
    const participantNames = await this.prismaService.member
      .findMany({
        where: {
          id: {
            in: participants,
          },
        },
        select: {
          nickname: true,
        },
      })
      .then((members) => members.map(({ nickname }) => nickname));

    const createdRoom = await this.prismaService.chatroom.create({
      data: {
        name: participantNames.join(', ') + '의 채팅방',
        members: {
          create: participants.map((id) => ({ memberId: id })),
        },
      },
    });

    return {
      roomId: createdRoom.id,
    };
  }

  async getMessages(
    roomId: string,
    cursor?: number,
    limit = 10,
  ): Promise<Message[]> {
    let messages: Message[] = [];

    // 최신 메시지를 가져오기 위해 cursor가 없을 때만 캐시에서 메시지를 가져옴
    messages = await this.getMessagesFromCache(roomId, cursor, limit);

    // 캐시에 메시지가 없거나 cursor가 있을 때 DB에서 메시지를 가져옴
    if (!messages.length) {
      messages = await this.getMessagesFromDB(roomId, cursor, limit);
      this.cacheMessages(roomId, messages);
    }

    return messages;
  }

  private async getMessagesFromDB(
    roomId: string,
    cursor: number,
    limit: number,
  ): Promise<Message[]> {
    const messages = await this.prismaService.chatroomMessage.findMany({
      where: { id: { lt: cursor }, chatroomId: roomId },
      take: limit,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        sender: { select: { id: true, nickname: true, avatar: true } },
        content: true,
        createdAt: true,
      },
    });

    return messages.map(({ content, ...rest }) => ({
      content: {
        message: content['message'],
        extra: content['extra'],
      },
      ...rest,
    }));
  }

  private async getMessagesFromCache(
    roomId: string,
    cursor: number,
    limit: number,
  ): Promise<Message[]> {
    const roomKey = `chatroom:${roomId}`;
    const cacheMessages = (
      (await this.cacheManager.get<Message[]>(roomKey)) || []
    ).reverse();

    const cursorMessageIndex = cursor
      ? cacheMessages.findIndex((message) => message.id === cursor - 1)
      : 0;

    if (cursorMessageIndex === -1) {
      return [];
    }

    const selectedMessages = cacheMessages.slice(
      cursorMessageIndex,
      cursorMessageIndex + limit,
    );

    return selectedMessages;
  }

  async cacheMessage(roomId: string, message: Message) {
    const roomKey = `chatroom:${roomId}`;
    const cachedMessages =
      (await this.cacheManager.get<Message[]>(roomKey)) || [];

    cachedMessages.push(message);

    await this.cacheManager.set(
      roomKey,
      cachedMessages,
      this.cacheConfig.chat.ttl,
    );
  }

  async cacheMessages(roomId: string, messages: Message[]) {
    const roomKey = `chatroom:${roomId}`;
    const cachedMessages =
      (await this.cacheManager.get<Message[]>(roomKey)) || [];

    const newMessages = messages.filter(
      (message) =>
        !cachedMessages.find(
          (cachedMessage) => cachedMessage.id === message.id,
        ),
    );

    cachedMessages.unshift(...newMessages.reverse());

    await this.cacheManager.set(
      roomKey,
      cachedMessages,
      this.cacheConfig.chat.ttl,
    );
  }

  async storeMessages(roomId: string) {
    const roomKey = `chatroom:${roomId}`;
    const messages = (await this.cacheManager.get<Message[]>(roomKey)) || [];

    const currentMessages = await this.prismaService.chatroomMessage.findMany({
      where: { chatroomId: roomId },
      select: { id: true },
    });
    const currentMessageIds = new Set(currentMessages.map(({ id }) => id));

    const newMessages = messages.filter(
      (message) => !currentMessageIds.has(message.id),
    );

    await this.prismaService.chatroomMessage.createMany({
      data: newMessages.map((message) => ({
        id: message.id,
        chatroomId: roomId,
        memberId: message.sender.id,
        content: {
          message: message.content.message,
          extra: message.content.extra.toString(),
        },
        createdAt: new Date(message.createdAt),
      })),
    });
  }

  async inviteMember(id: number, roomId: string, participants: number[]) {
    const currentParticipants = await this.prismaService.chatroomParticipants
      .findMany({
        where: {
          chatroomId: roomId,
        },
        select: {
          memberId: true,
        },
      })
      .then((members) => members.map(({ memberId }) => memberId));

    const newParticipants = participants.filter(
      (participant) => !currentParticipants.includes(participant),
    );

    return this.prismaService.chatroom.update({
      where: {
        id: roomId,
      },
      data: {
        members: {
          create: newParticipants.map((id) => ({ memberId: id })),
        },
      },
    });
  }

  async leaveRoom(roomId: string, memberId: number) {
    return this.prismaService.chatroomParticipants.delete({
      where: {
        chatroomId_memberId: {
          chatroomId: roomId,
          memberId,
        },
      },
    });
  }

  async deleteRoom(roomId: string) {
    return this.prismaService.chatroom.delete({
      where: {
        id: roomId,
      },
    });
  }

  async getLastMessageIndex(roomId: string) {
    const lastMessageIndexKey = `chatroom:${roomId}:lastMessage`;
    let lastMessageIndex =
      await this.cacheManager.get<number>(lastMessageIndexKey);

    if (!lastMessageIndex) {
      lastMessageIndex = await this.prismaService.chatroomMessage
        .findFirst({
          where: {
            chatroomId: roomId,
          },
          orderBy: {
            id: 'desc',
          },
          select: { id: true },
        })
        .then((message) => message?.id || 0);
    }
    return +lastMessageIndex;
  }

  async setLastMessageIndex(roomId: string, index: number) {
    const lastMessageIndexKey = `chatroom:${roomId}:lastMessage`;

    await this.cacheManager.set(
      lastMessageIndexKey,
      index,
      this.cacheConfig.chat.ttl,
    );
  }

  async updateReservationMessage(roomId: string, reservation: Reservation) {
    const roomKey = `chatroom:${roomId}`;
    const messages = await this.cacheManager.get<Message[]>(roomKey);

    const targetIndex = messages.findIndex((message) => {
      if (
        message.content.extra &&
        message.content.extra.type === 'reservation'
      ) {
        return message.content.extra.data.id === reservation.id;
      }
    });
    if (targetIndex === -1) {
      throw new NotFoundException(ErrorMessage.NOTFOUND_MESSAGE);
    }

    messages[targetIndex].content.extra.data = reservation;
    await this.cacheManager.set(roomKey, messages, this.cacheConfig.chat.ttl);
  }
}
