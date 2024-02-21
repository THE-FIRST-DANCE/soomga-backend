import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Coolsms, { Message } from 'coolsms-node-sdk';

@Injectable()
export class CoolsmsService extends Coolsms {
  constructor(private readonly configService: ConfigService) {
    super(
      configService.get<string>('COOLSMS_API_KEY'),
      configService.get<string>('COOLSMS_API_SECRET'),
    );
  }

  async sendAuthCode(phoneNumber: string, authCode: string) {
    const message: Message = {
      to: phoneNumber,
      from: this.configService.get<string>('COOLSMS_PHONE_NUMBER'),
      text: `[Soomga] 인증번호는 ${authCode} 입니다. 5분 내에 입력해주세요.`,
      autoTypeDetect: false,
      type: 'SMS',
    };

    return this.sendOne(message);
  }
}
