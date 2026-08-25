import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../../../api";
import { useAuthStore } from "../../../store/useAuthStore";
import type { LoginResponse } from "../login/types/login.types";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

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

    const accessExpires = new Date(accessTokenExpiresAtUtc);
    const refreshExpires = new Date(refreshTokenExpiresAtUtc);

    Cookies.set(AUTH_TOKEN_COOKIE, accessToken, { expires: accessExpires });
    if (newRefreshToken) {
      Cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
        expires: refreshExpires,
      });
    }

    useAuthStore.getState().setAuth(data.data);
    return true;
  } catch {
    useAuthStore.getState().clearAuth();
    return false;
  }
};