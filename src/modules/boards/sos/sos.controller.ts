import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SOSService } from './sos.service';
import { CreateSOSDto } from './dto/create-sos.dto';
import { UpdateSOSDto } from './dto/update-sos.dto';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { ParseIntWithDefaultPipe } from 'src/shared/pagination/pagination.pipe';

@ApiTags('SOS 게시판 API')
@Controller('sos')
export class SOSController {
  constructor(private readonly sosService: SOSService) {}

  @ApiOperation({ summary: 'Create a new SOS' })
  @Post()
  create(@Body() createSosDto: CreateSOSDto) {
    return this.sosService.create(createSosDto);
  }

  @ApiOperation({ summary: 'Get all SOS' })
  @Get()
  findAll() {
    return this.sosService.findAll();
  }

  @ApiOperation({ summary: 'Get all SOS with pagination' })
  @Get('search')
  @Pagination()
  async search(
    @Query('cursor', ParseIntWithDefaultPipe) cursor?: number,
    @Query('limit', ParseIntWithDefaultPipe) limit?: number,
  ) {}

  @ApiOperation({ summary: 'Get a specific SOS by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sosService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a specific SOS by ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSosDto: UpdateSOSDto) {
    return this.sosService.update(+id, updateSosDto);
  }

  @ApiOperation({ summary: 'Remove a specific SOS by ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sosService.remove(+id);
  }
}
