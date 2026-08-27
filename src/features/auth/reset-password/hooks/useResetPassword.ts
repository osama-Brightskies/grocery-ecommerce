import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../api";
import { resetPasswordApi } from "../api/reset-password.api";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password.types";

type UseResetPasswordOptions = {
  onSuccess?: (
    data: ResetPasswordResponse,
    variables: ResetPasswordRequest,
  ) => void;
  onError?: (error: ApiError, variables: ResetPasswordRequest) => void;
};

export const useResetPassword = (options?: UseResetPasswordOptions) => {
  return useMutation<ResetPasswordResponse, ApiError, ResetPasswordRequest>({
    mutationFn: resetPasswordApi,

    onSuccess: (response, variables) => {
      options?.onSuccess?.(response, variables);
    },

    onError: (error, variables) => {
      options?.onError?.(error, variables);
    },
  });
};
