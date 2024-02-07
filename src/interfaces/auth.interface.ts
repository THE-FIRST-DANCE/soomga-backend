import { $Enums } from '@prisma/client';

export interface AuthPayload {
  sub: number;
  email: string;
  nickname: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleProfile {
  id: string;
  emails: { value: string; verified: boolean }[];
  name: {
    givenName: string;
    familyName?: string;
  };
  photos: { value: string }[];
  provider: string;
  accessToken: string;
}

export interface OAuthProfile {
  email: string;
  nickname: string;
  avatar: string;
  provider: $Enums.Provider;
  accessToken: string;
}
