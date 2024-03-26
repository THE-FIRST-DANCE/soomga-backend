import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatRepository } from './chat.repository';
import { ChatController } from './chat.controller';
import ChatGateway from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    ChatService,
    ChatRepository,
    ChatGateway,
    AuthRepository,
    JwtService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
