import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { REFRESH_TOKEN_COOKIE, type ApiError } from "../../../../api";
import { logoutApi } from "../api/logout.api";

type UseLogoutOptions = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};

export const useLogout = (options?: UseLogoutOptions) => {
  return useMutation<void, ApiError, void>({
    mutationFn: () => {
      const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE) || "";
      return logoutApi(refreshToken);
    },

    onSuccess: () => {
      options?.onSuccess?.();
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
