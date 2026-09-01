import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../../../api";
import { useAuthStore } from "../../../store/useAuthStore";
import type { LoginResponse } from "../login/types/login.types";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

const getValidDate = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

export const executeSilentRefresh = async (): Promise<boolean> => {
  const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);

  if (!refreshToken) {
    useAuthStore.getState().clearAuth();
    return false;
  }

  try {
    const { data } = await axios.post<LoginResponse>(
      `${baseURL}/api/auth/refresh`,
      { refreshToken },
    );

    const {
      accessToken,
      accessTokenExpiresAtUtc,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAtUtc,
    } = data.data;

    const activeRefreshToken = newRefreshToken || refreshToken;
    const accessExpires = getValidDate(accessTokenExpiresAtUtc);
    const refreshExpires = getValidDate(refreshTokenExpiresAtUtc);

    // Save Access Token & Refresh Token with root path '/'
    Cookies.set(AUTH_TOKEN_COOKIE, accessToken, {
      expires: accessExpires,
      path: "/",
    });
    Cookies.set(REFRESH_TOKEN_COOKIE, activeRefreshToken, {
      expires: refreshExpires,
      path: "/",
    });

    // Update Zustand State & Schedule NEXT Proactive Timer
    useAuthStore.getState().setAuth({
      ...data.data,
      refreshToken: activeRefreshToken,
    });

    return true;
  } catch {
    useAuthStore.getState().clearAuth();
    return false;
  }
};
