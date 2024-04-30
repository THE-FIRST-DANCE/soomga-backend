import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import moment from 'moment';
import { AwsConfig } from 'src/configs/config.interface';
import axios from 'axios';

@Injectable()
export class AwsService {
  s3Client: S3Client;
  awsConfig: AwsConfig;

  constructor(readonly configService: ConfigService) {
    this.awsConfig = configService.get<AwsConfig>('aws');
    this.s3Client = new S3Client({
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.s3AccessKey,
        secretAccessKey: this.awsConfig.s3SecretAccessKey,
      },
    });
  }

  async uploadFile(originalName: string, file: Express.Multer.File) {
    const fileName = `${randomUUID()}_${originalName}`;
    const key = `uploads/${moment().format('YYMMDD')}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.awsConfig.s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: `attachment; filename="${encodeURIComponent(originalName)}"`,
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.awsConfig.s3Bucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('🐊 Error uploading file: ', error);
      throw error;
    }
  }

  async uploadFileFromUrl(url: string, fileName: string) {
    const key = `uploads/${moment().format('YYMMDD')}/${fileName}`;

    const response = await axios({
      method: 'get',
      url,
      responseType: 'stream',
    });

    const command = new PutObjectCommand({
      Bucket: this.awsConfig.s3Bucket,
      Key: key,
      Body: response.data, // 스트림으로 바로 AWS S3에 업로드
      ContentType: response.headers['content-type'],
      ContentLength: response.headers['content-length'],
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.awsConfig.s3Bucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}
