import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Content, Message } from '../../interfaces/chat.interface';
import { UpdateRoomDto } from './dto/update-room.dto';
import ErrorMessage from 'src/shared/constants/error-messages.constants';
import { Reservation, Role } from '@prisma/client';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { createLogger } from 'winston';

export class ChatRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

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
    const lastMessageIndex = +(await this.redis.get(
      `chatroom:${roomId}:lastMessage`,
    ));

    const start = cursor ? cursor - 1 : '+inf';
    const end = cursor ? cursor - limit : lastMessageIndex - limit;

    const raw = await this.redis.zrevrangebyscore(roomKey, start, end);

    const cacheMessages = raw.map((message) =>
      JSON.parse(message),
    ) as Message[];

    return cacheMessages;
  }

  async cacheMessage(roomId: string, message: Message) {
    const roomKey = `chatroom:${roomId}`;
    const nextIndex = (await this.getLastMessageIndex(roomId)) + 1;

    await this.redis.zadd(roomKey, nextIndex, JSON.stringify(message));
  }

  async cacheMessages(roomId: string, messages: Message[]) {
    if (!messages.length) return;

    const roomKey = `chatroom:${roomId}`;

    console.log('🚀 ~ ChatRepository ~ messages.forEach ~ messages:', messages);
    const scoreMembers: (string | number)[] = [];
    messages.forEach((message) => {
      scoreMembers.push(message.id);
      scoreMembers.push(JSON.stringify(message));
    });

    this.redis.zadd(roomKey, ...scoreMembers);
  }

  async storeMessages(roomId: string) {
    const roomKey = `chatroom:${roomId}`;

    const raw = await this.redis.zrevrange(roomKey, 0, -1);

    const cachedMessages = raw.map((message) =>
      JSON.parse(message),
    ) as Message[];

    await Promise.all(
      cachedMessages.map((message) =>
        this.prismaService.chatroomMessage.upsert({
          where: { id: message.id },
          update: {},
          create: {
            id: message.id,
            chatroomId: roomId,
            memberId: message.sender.id,
            content: {
              message: message.content.message,
              extra: message.content.extra?.toString(),
            },
            createdAt: new Date(message.createdAt),
          },
        }),
      ),
    );
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
    let lastMessageIndex = +(await this.redis.get(lastMessageIndexKey));

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

    await this.redis.set(lastMessageIndexKey, index);
  }

  async updateReservationMessage(roomId: string, reservation: Reservation) {
    const roomKey = `chatroom:${roomId}`;
    const raw = await this.redis.zrange(roomKey, 0, -1);

    const cachedMessages = raw.map((message) =>
      JSON.parse(message),
    ) as Message[];

    const target = cachedMessages.find((message) => {
      if (
        message.content?.extra &&
        message.content?.extra.type === 'reservation'
      ) {
        return message.content.extra.data.id === reservation.id;
      }
    });
    if (!target) {
      throw new NotFoundException(ErrorMessage.NOTFOUND_MESSAGE);
    }

    await this.redis.zrem(roomKey, target.id, JSON.stringify(target));

    target.content.extra.data = reservation;

    console.log(
      '🚀 ~ ChatRepository ~ updateReservationMessage ~ target.id:',
      target.id,
    );
    await this.redis.zadd(roomKey, target.id, JSON.stringify(target));
  }

  ioJoinRoom(roomId: string, clientId: string) {
    return this.redis.sadd(`chatroom:${roomId}:members`, clientId);
  }

  ioLeaveRoom(roomId: string, clientId: string) {
    return this.redis.srem(`chatroom:${roomId}:members`, clientId);
  }

  async ioLeaveAllRooms(clientId: string) {
    return this.redis.keys(`chatroom:*:members`).then((keys) => {
      return Promise.all(
        keys.map((key) => {
          this.redis.srem(key, clientId);
          this.redis.scard(key).then((members) => {
            if (!members) {
              const roomId = key.split(':')[1];
              console.log('🚀 ~ ioLeaveAllRooms ~ roomId:', roomId);
              this.storeMessages(roomId);
            }
          });
        }),
      );
    });
  }
}
