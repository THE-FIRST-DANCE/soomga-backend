import { Injectable } from '@nestjs/common';
import Expo from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  constructor() {}

  private expo = new Expo();

  async sendPushNotification(title: string, body: string, data: any) {
    const token = 'ExponentPushToken[Zx_bn3Nlu11SYpC3SZda0V]';

    const messages = [];
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      return;
    }

    messages.push({
      to: token,
      sound: 'default',
      title,
      body,
      data: { ...data },
    });

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
