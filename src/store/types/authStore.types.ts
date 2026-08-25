import type { LoginData } from "../../features/auth/login/types/login.types";

export type UserProfile = {
  userId: string;
  role: number;
};

export type AuthState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (data: LoginData) => void;
  clearAuth: () => void;
};