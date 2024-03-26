import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatRepository } from './chat.repository';
import { AuthRepository } from '../auth/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../../interfaces/auth.interface';
import { Content, Message } from '../../interfaces/chat.interface';

@WebSocketGateway(4000, { cors: true })
export default class ChatGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Socket;

  private connectedClients: Socket[] = [];

  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    console.log('🚀 ~ handleConnection ~ client.id:', client.id);
  }
  async handleDisconnect(client: Socket): Promise<void> {
    console.log('🚀 ~ handleDisconnect ~ client.id:', client.id);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    client: Socket,
    data: {
      roomId: string;
    },
  ) {
    await client.join(data.roomId);

    console.log('🚀 ~ client.join:', data.roomId);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    client: Socket,
    data: {
      roomId: string;
    },
  ) {
    client.leave(data.roomId);
    console.log('🚀 ~ client.leave:', data.roomId);
  }

  @SubscribeMessage('newMessage')
  async newMessage(
    client: Socket,
    data: {
      roomId: string;
      accessToken: string;
      content: Content;
    },
  ) {
    const decoded = this.jwtService.decode<AuthPayload>(data.accessToken);
    if (!decoded) return; // TODO: access token이 유효하지 않을 때 처리를 추가하자 (written on 2024. 03. 22, 17:29)

    let lastMessageIndex = await this.chatRepository.getLastMessageIndex(
      data.roomId,
    );

    const message: Message = {
      id: ++lastMessageIndex,
      content: data.content,
      sender: {
        id: decoded.sub,
        nickname: decoded.nickname,
        avatar: decoded.avatar,
      },
      createdAt: new Date(),
    };

    await this.chatRepository.cacheMessage(data.roomId, message);
    await this.chatRepository.setLastMessageIndex(
      data.roomId,
      lastMessageIndex,
    );

    this.server.to(data.roomId).emit('newMessage', message);
  }

  // @SubscribeMessage('loginClient')
  // async loginClient(
  //   client: Socket,
  //   data: {
  //     accessToken: string;
  //   },
  // ) {
  //   const socketId = client.id;
  //   if (!data.accessToken) return;

  //   this.authRepository.loginClient(socketId, data);
  // }

  // private addClient(client: Socket) {
  //   this.connectedClients.push(client);
  // }

  // private removeClient(client: Socket) {
  //   const idx = this.connectedClients.indexOf(client);
  //   if (idx !== -1) {
  //     this.connectedClients.splice(idx, 1);
  //   }
  // }
}
