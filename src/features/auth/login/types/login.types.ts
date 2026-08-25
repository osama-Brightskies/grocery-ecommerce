// Exact structure returned by backend
export type LoginData = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
  role: number;
  userId: string;
};

export type LoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoginData;
};
