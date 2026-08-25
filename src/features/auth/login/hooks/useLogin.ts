import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  AUTH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  type ApiError,
} from "../../../../api/";
import { useAuthStore } from "../../../../store/useAuthStore";
import { loginApi } from "../api/login.api";
import type { LoginFormTypes } from "../schemas/login.schema";
import type { LoginResponse } from "../types/login.types";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, ApiError, LoginFormTypes>({
    mutationFn: loginApi,

    onSuccess: (response) => {
      const {
        accessToken,
        accessTokenExpiresAtUtc,
        refreshToken,
        refreshTokenExpiresAtUtc,
      } = response.data;

      // Convert server UTC ISO timestamps into JavaScript Date objects
      const accessExpires = new Date(accessTokenExpiresAtUtc);
      const refreshExpires = new Date(refreshTokenExpiresAtUtc);

      Cookies.set(AUTH_TOKEN_COOKIE, accessToken, { expires: accessExpires });
      if (refreshToken) {
        Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
          expires: refreshExpires,
        });
      }

      // 2. Set Global Zustand Auth State
      setAuth(response.data);

      // TODO: Redirect to Dashboard once React Router is connected
      // Example: navigate("/dashboard");
    },

    onError: (error) => {
      console.error("❌ Login Failed:", error.message);
    },
  });
};