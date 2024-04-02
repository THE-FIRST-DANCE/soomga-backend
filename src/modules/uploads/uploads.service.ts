import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { randomUUID } from 'crypto';
import { UploadsRepository } from './uploads.repository';

@Injectable()
export class UploadsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly uploadsRepository: UploadsRepository,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${randomUUID()}_${file.originalname}`;
    const url = await this.awsService.uploadFile(fileName, file);
    return this.uploadsRepository.fileUpload(file.originalname, url);
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const data = await Promise.all(files.map((file) => this.uploadFile(file)));
    return data;
  }
}
