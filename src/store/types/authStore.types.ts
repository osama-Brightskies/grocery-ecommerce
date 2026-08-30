import type { LoginData } from "@/features/auth/login/types/login.types";

export const UserRole = {
  User: 0,
  Admin: 1,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type UserProfile = {
  userId: string;
  role: UserRole;
};

export type AuthState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (data: LoginData) => void;
  clearAuth: () => void;
};
