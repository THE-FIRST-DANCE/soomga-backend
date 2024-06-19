import { Global, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatRepository } from './chat.repository';
import { ChatController } from './chat.controller';
import ChatGateway from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Global()
@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    ChatService,
    ChatRepository,
    ChatGateway,
    {
      provide: 'IO_SERVER',
      useFactory: (gateway: ChatGateway) => gateway.server,
      inject: [ChatGateway],
    },
    AuthRepository,
    JwtService,
  ],
  controllers: [ChatController],
  exports: [ChatService, 'IO_SERVER'],
})
export class ChatModule {}
