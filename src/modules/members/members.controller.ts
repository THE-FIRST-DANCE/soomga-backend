import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
