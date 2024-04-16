import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuideGuard } from '../auth/auth.guard';
import { Member } from '@prisma/client';
import { User } from '../auth/auth.decorator';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceDto } from './dto/create-services.dto';

@ApiTags('서비스 API')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(AuthGuideGuard)
  @ApiOperation({ summary: '서비스 생성' })
  create(
    @User() { id: guideId }: Member,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(guideId, createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: '서비스 전체 조회' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '서비스 조회' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuideGuard)
  @ApiOperation({ summary: '서비스 수정' })
  update(
    @Param('id') id: string,
    @User() { id: guideId }: Member,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(+id, guideId, updateServiceDto);
  }
}
