import { http } from "@/api";

export const logoutApi = (refreshToken: string) => {
  return http.post<void>("/api/auth/logout", { refreshToken });
};
