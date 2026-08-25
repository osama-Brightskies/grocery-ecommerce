import Cookies from "js-cookie";
import { create } from "zustand";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../api";
import { executeSilentRefresh } from "../features/auth/api/refresh.api";
import type { LoginData } from "../features/auth/login/types/login.types";
import type { AuthState } from "./types/authStore.types";

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (data: LoginData) => {
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
      refreshTimerId = null;
    }

    // Real production math: Refresh 2 minutes before the token actually expires
    const expiresAt = new Date(data.accessTokenExpiresAtUtc).getTime();
    const twoMinutes = 2 * 60 * 1000;
    const timeUntilRefresh = expiresAt - Date.now() - twoMinutes;

    if (timeUntilRefresh > 10000) {
      refreshTimerId = setTimeout(() => {
        executeSilentRefresh();
      }, timeUntilRefresh);
    }

    set({
      user: {
        userId: data.userId,
        role: data.role,
      },
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
      refreshTimerId = null;
    }

    Cookies.remove(AUTH_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
