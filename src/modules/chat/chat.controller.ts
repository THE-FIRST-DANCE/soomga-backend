import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Member } from '@prisma/client';
import { User } from '../auth/auth.decorator';
import {
  AuthAdminGuard,
  AuthGuideGuard,
  AuthMemberGuard,
} from '../auth/auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { Pagination } from '../../shared/decorators/pagination.decorator';
import { ParseIntWithDefaultPipe } from '../../shared/pagination/pagination.pipe';
import { InviteMemberDto } from './dto/invite-member.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateReservationDto } from '../reservations/dto/create-reservation';

@ApiTags('채팅 API')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the list of chat rooms' })
  async getRoomList(@User() user: Member) {
    const { id } = user;
    return this.chatService.getRoomList(id);
  }

  @Post()
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new chat room' })
  async createRoom(@User() user: Member, @Body() createRoomDto: CreateRoomDto) {
    const { id } = user;
    return this.chatService.createRoom(id, createRoomDto);
  }

  @Patch(':roomId')
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a chat room' })
  async updateRoom(
    @Param('roomId') roomId: string,
    @User() user: Member,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    const { id: memberId } = user;
    return this.chatService.updateRoom(roomId, memberId, updateRoomDto);
  }

  @Get(':roomId')
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific chat room by ID' })
  async getRoom(@Param('roomId') roomId: string) {
    return this.chatService.getRoom(roomId);
  }

  @Delete(':roomId')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific chat room' })
  async deleteRoom(@Param('roomId') roomId: string) {
    return this.chatService.deleteRoom(roomId);
  }

  @Get(':roomId/messages')
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @Pagination()
  @ApiOperation({ summary: 'Get the messages of a specific chat room' })
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {
    return this.chatService.getMessages(roomId, cursor, limit);
  }

  @Post(':roomId/messages/store')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Store the messages of a specific chat room' })
  async storeMessages(@Param('roomId') roomId: string) {
    return this.chatService.storeMessages(roomId);
  }

  @Post(':roomId/invite')
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a member to a specific chat room' })
  async inviteMember(
    @User() user: Member,
    @Param('roomId') roomId: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    const { id } = user;
    return this.chatService.inviteMember(id, roomId, inviteMemberDto);
  }

  @Delete(':roomId/leave')
  @UseGuards(AuthMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a specific chat room' })
  async leaveRoom(@User() user: Member, @Param('roomId') roomId: string) {
    const { id } = user;
    return this.chatService.leaveRoom(roomId, id);
  }
}
