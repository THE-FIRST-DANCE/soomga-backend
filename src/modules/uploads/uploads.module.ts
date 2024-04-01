import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { AwsModule } from '../aws/aws.module';
import { UploadsRepository } from './uploads.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsRepository],
})
export class UploadsModule {}
