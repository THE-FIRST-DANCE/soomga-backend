import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MembersRepository } from './members.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MembersController],
  providers: [MembersService, PrismaService, MembersRepository],
  exports: [MembersService, MembersRepository],
})
export class MembersModule {}
