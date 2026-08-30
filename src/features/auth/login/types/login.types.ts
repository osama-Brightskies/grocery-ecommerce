import type { UserRole } from "@/store/types/authStore.types";

export type LoginData = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
  role: UserRole;
  userId: string;
};

export type LoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoginData;
};
