import { Module } from '@nestjs/common';
import { PersonalizeEventsClient } from '@aws-sdk/client-personalize-events';
import { ConfigService } from '@nestjs/config';
import { PersonalizeConfig } from 'src/configs/config.interface';
import { PersonalizeService } from './personalize.service';
import { PersonalizeRuntimeClient } from '@aws-sdk/client-personalize-runtime';

@Module({
  providers: [
    PersonalizeService,
    {
      provide: PersonalizeEventsClient,
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<PersonalizeConfig>('personalize');
        return new PersonalizeEventsClient(config);
      },
      inject: [ConfigService],
    },
    {
      provide: PersonalizeRuntimeClient,
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<PersonalizeConfig>('personalize');
        return new PersonalizeRuntimeClient(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    PersonalizeService,
    PersonalizeEventsClient,
    PersonalizeRuntimeClient,
  ],
})
export class PersonalizeModule {}
