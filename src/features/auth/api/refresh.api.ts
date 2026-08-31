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

    // 1. SET COOKIES SYNCHRONOUSLY (0ms delay)
    Cookies.set(AUTH_TOKEN_COOKIE, accessToken, {
      expires: accessExpires,
      path: "/",
    });
    Cookies.set(REFRESH_TOKEN_COOKIE, activeRefreshToken, {
      expires: refreshExpires,
      path: "/",
    });

    // 2. PROOF: Read cookies from RAM on the very next line of code
    console.log("⚡ INSTANT VERIFICATION (0ms delay):");
    console.log(
      " - Active Access Token in RAM:",
      Cookies.get(AUTH_TOKEN_COOKIE),
    );
    console.log(
      " - Active Refresh Token in RAM:",
      Cookies.get(REFRESH_TOKEN_COOKIE),
    );

    // 3. Update Zustand state
    useAuthStore.getState().setAuth({
      ...data.data,
      refreshToken: activeRefreshToken,
    });

    return true;
  } catch (error) {
    console.error(
      "❌ Silent Refresh Failed -> Triggering Forced Logout",
      error,
    );
    useAuthStore.getState().clearAuth();
    return false;
  }
};
