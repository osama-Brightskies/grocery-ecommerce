import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../api/auth.constants";
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
        // 1. Clear any active timer to prevent duplicate overlapping timers
        if (refreshTimerId) {
          clearTimeout(refreshTimerId);
          refreshTimerId = null;
        }

        // 2. Production Math: Refreshes 2 minutes before token expires (~13 minutes for a 15-minute token)
        const expiresAt = new Date(data.accessTokenExpiresAtUtc).getTime();
        const twoMinutes = 2 * 60 * 1000;
        const timeUntilRefresh = expiresAt - Date.now() - twoMinutes;

        // 3. Schedule next proactive refresh if remaining time is valid
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

        // Always pass path: '/' when removing cookies
        Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
        Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });

        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "BigCart_auth_session",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
