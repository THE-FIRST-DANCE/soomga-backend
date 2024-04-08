import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Response } from 'express';
import { Member } from '@prisma/client';
import { AuthDeletedGuard, AuthMemberGuard } from '../auth/auth.guard';
import { User } from '../auth/auth.decorator';

@ApiTags('멤버 API')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOperation({
    summary: '새 멤버 생성',
    description: '새로운 멤버를 생성합니다.',
  })
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @ApiOperation({
    summary: '모든 멤버 조회',
    description: '모든 멤버의 정보를 조회합니다.',
  })
  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @ApiOperation({
    summary: '멤버 탈퇴',
    description: '특정 아이디를 가진 멤버를 탈퇴 처리합니다.',
  })
  @Get('leave')
  @UseGuards(AuthMemberGuard)
  async leave(@User() user: Member, @Res() res: Response) {
    const { id } = user;
    await this.membersService.leave(id);

    return res.json({ message: '탈퇴 처리가 완료되었습니다.' });
  }

  @ApiOperation({
    summary: '멤버 복귀',
    description: '특정 아이디를 가진 멤버를 복귀 처리합니다.',
  })
  @Get('comeback')
  @UseGuards(AuthDeletedGuard)
  async comback(@User() user: Member, @Res() res: Response) {
    const { id } = user;
    await this.membersService.comeback(id);

    return res.json({ message: '복귀 처리가 완료되었습니다.' });
  }

  @ApiOperation({
    summary: '아이디로 멤버 조회',
    description: '특정 아이디를 가진 멤버의 정보를 조회합니다.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @ApiOperation({
    summary: '아이디로 멤버 업데이트',
    description: '특정 아이디를 가진 멤버의 정보를 업데이트합니다.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @ApiOperation({
    summary: '아이디로 멤버 삭제',
    description: '특정 아이디를 가진 멤버를 삭제합니다.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }

  @ApiOperation({
    summary: '멤버 언어 업데이트',
    description: '특정 아이디를 가진 멤버의 언어 정보를 업데이트합니다.',
  })
  @Patch(':id/languages')
  updateLanguages(
    @Param('id') id: string,
    @Body() { languageIds }: UpdateLanguageDto,
  ) {
    return this.membersService.updateLanguages(+id, languageIds);
  }

  @ApiOperation({
    summary: '팔로우 하기',
    description: '특정 아이디를 가진 멤버를 팔로우합니다.',
  })
  @Get(':followingId/follow')
  @UseGuards(AuthMemberGuard)
  async follow(
    @User() user: Member,
    @Param('followingId') followingId: string,
    @Res() res: Response,
  ) {
    const { id: followerId } = user;
    const isFollowing = await this.membersService.followToggle(
      +followingId,
      +followerId,
    );
    return res.json({
      message: isFollowing
        ? '팔로우가 완료되었습니다.'
        : '언팔로우가 완료되었습니다.',
    });
  }
}
