import { $Enums } from '@prisma/client';

export interface AuthPayload {
  sub: number;
  email?: string;
  nickname: string;
  avatar?: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthPayload;
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

export interface LineProfile {
  displayName: string;
  id: string;
  pictureUrl: string;
  provider: $Enums.Provider;
}

export interface OAuthProfile {
  nickname: string;
  avatar: string;
  provider: $Enums.Provider;
  providerId: string;
  accessToken: string;
}

export interface AuthCodePayload {
  sub: number;
  authCode: string;
  phoneNumber: string;
}
