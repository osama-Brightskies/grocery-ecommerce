import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  AUTH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  type ApiError,
} from "../../../../api/";
import type { LoginResponse } from "../types/login.types";
import type { LoginFormTypes } from "../schemas/login.schema";
import { useAuthStore } from "@/store/useAuthStore";
import { loginApi } from "../api/login.api";

type UseLoginOptions = {
  onSuccess?: (data: LoginResponse, variables: LoginFormTypes) => void;
  onError?: (error: ApiError, variables: LoginFormTypes) => void;
};

export const useLogin = (options?: UseLoginOptions) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, ApiError, LoginFormTypes>({
    mutationFn: loginApi,

    onSuccess: (response, variables) => {
      const {
        accessToken,
        accessTokenExpiresAtUtc,
        refreshToken,
        refreshTokenExpiresAtUtc,
      } = response.data;

      const accessExpires = new Date(accessTokenExpiresAtUtc);
      const refreshExpires = new Date(refreshTokenExpiresAtUtc);

      // 1. Store Access Token & Refresh Token in Cookies with root path '/'
      Cookies.set(AUTH_TOKEN_COOKIE, accessToken, {
        expires: accessExpires,
        path: "/",
      });
      if (refreshToken) {
        Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
          expires: refreshExpires,
          path: "/",
        });
      }

      // 2. Set Global Zustand Auth State & Schedule Proactive Timer
      setAuth(response.data);

      // 3. Trigger UI callback (e.g. toast & navigate in LoginPage)
      options?.onSuccess?.(response, variables);
    },

    onError: (error, variables) => {
      options?.onError?.(error, variables);
    },
  });
};
