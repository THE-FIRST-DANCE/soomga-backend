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
