import {
  PersonalizeEventsClient,
  PutEventsCommandInput,
  PutEventsCommand,
} from '@aws-sdk/client-personalize-events';
import {
  GetRecommendationsCommand,
  PersonalizeRuntimeClient,
} from '@aws-sdk/client-personalize-runtime';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PersonalizeConfig } from 'src/configs/config.interface';

@Injectable()
export class PersonalizeService {
  personalizeConfig: PersonalizeConfig;

  constructor(
    private readonly eventClient: PersonalizeEventsClient,
    private readonly runtimeClient: PersonalizeRuntimeClient,
    private readonly configService: ConfigService,
  ) {
    this.personalizeConfig =
      this.configService.get<PersonalizeConfig>('personalize');
  }

  async clickEvent(sessionId: string, itemId: number, userId?: number) {
    console.log('🚀 ~ PersonalizeService ~ clickEvent ~ input:', 'clicked!');

    const input: PutEventsCommandInput = {
      trackingId: this.personalizeConfig.trackingId,
      sessionId,
      userId: userId?.toString(),
      eventList: [
        {
          eventType: 'click',
          eventValue: 1.2,
          itemId: itemId.toString(),
          sentAt: new Date(),
          metricAttribution: {
            eventAttributionSource: 'source',
          },
        },
      ],
    };

    const command = new PutEventsCommand(input);
    return this.eventClient.send(command);
  }

  async getRecommendations(event: { userId: string }, context?: any) {
    try {
      const userId = event.userId;

      const params = {
        campaignArn: this.personalizeConfig.campaignArn,
        userId,
      };

      const command = new GetRecommendationsCommand(params);
      const response = await this.runtimeClient.send(command);

      const recommendedItems = response.itemList.map((item) =>
        Number(item.itemId),
      );
      console.log(
        '🚀 ~ PersonalizeService ~ getRecommendations ~ recommendedItems:',
        recommendedItems,
      );

      return recommendedItems;
    } catch (error) {
      console.error(
        '🚀 ~ PersonalizeService ~ getRecommendations ~ error:',
        error,
      );
      return [];
    }
  }
}
