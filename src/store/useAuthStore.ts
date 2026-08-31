import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../api";
import { executeSilentRefresh } from "../features/auth/api/refresh.api";
import type { LoginData } from "../features/auth/login/types/login.types";
import type { AuthState } from "./types/authStore.types";

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: !!Cookies.get(AUTH_TOKEN_COOKIE),

      setAuth: (data: LoginData) => {
        if (refreshTimerId) {
          clearTimeout(refreshTimerId);
          refreshTimerId = null;
        }

        // Production Math: Refreshes 2 minutes before token expires (~13 minutes for a 15-min token)
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

        Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
        Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });

        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "BigCart_auth_session", // Defaults to localStorage automatically
    },
  ),
);
