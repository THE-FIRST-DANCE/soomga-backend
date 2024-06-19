import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiOperationOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthAdminGuard } from '../auth/auth.guard';
import { DeactivateMembersDto } from './dto/deactivate-members.dto';
import { ActivateMembersDto } from './dto/activate-members.dto';
import { DeleteMembersDto } from './dto/delete-members.dto';
import { Response } from 'express';

@ApiTags('관리자 API')
@UseGuards(AuthAdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('activate-members')
  @ApiOperation({
    summary: '멤버 활성화',
    description: '멤버를 활성화 처리합니다.',
  })
  @ApiOkResponse({ description: '멤버 활성화 처리가 완료되었습니다.' })
  async activateMembers(
    @Body() activateMembersDto: ActivateMembersDto,
    @Res() res: Response,
  ) {
    await this.adminService.activateMembers(activateMembersDto);
    return res.json({
      message: '멤버 활성화 처리가 완료되었습니다.',
    });
  }

  @Post('deactivate-members')
  @ApiOperation({
    summary: '멤버 비활성화',
    description: '멤버를 비활성화 처리합니다.',
  })
  @ApiOkResponse({ description: '멤버 비활성화 처리가 완료되었습니다.' })
  async deactivateMembers(
    @Body() deactivateMembersDto: DeactivateMembersDto,
    @Res() res: Response,
  ) {
    await this.adminService.deactivateMembers(deactivateMembersDto);
    return res.json({
      message: '멤버 비활성화 처리가 완료되었습니다.',
    });
  }

  @Post('delete-members')
  @ApiOperation({
    summary: '멤버 삭제',
    description: '멤버를 삭제 처리합니다.',
  })
  @ApiOkResponse({ description: '멤버 삭제 처리가 완료되었습니다.' })
  async deleteMembers(
    @Body() deleteMembersDto: DeleteMembersDto,
    @Res() res: Response,
  ) {
    await this.adminService.deleteMembers(deleteMembersDto);
    return res.json({
      message: '멤버 삭제 처리가 완료되었습니다.',
    });
  }
}
