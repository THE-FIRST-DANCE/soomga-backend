import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { UploadsRepository } from './uploads.repository';
import iconv from 'iconv-lite';

@Injectable()
export class UploadsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly uploadsRepository: UploadsRepository,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const originalName = iconv.decode(
      Buffer.from(file.originalname, 'binary'),
      'utf-8',
    );

    const url = await this.awsService.uploadFile(originalName, file);
    return this.uploadsRepository.fileUpload(originalName, url);
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const data = await Promise.all(files.map((file) => this.uploadFile(file)));
    return data;
  }
}
