import { $Enums } from '@prisma/client';

export class OAuthSignUpDto {
  nickname: string;
  password: string;
  avatar?: string;
  provider: $Enums.Provider;
  providerId: string;
  birthdate?: string | Date;
}
