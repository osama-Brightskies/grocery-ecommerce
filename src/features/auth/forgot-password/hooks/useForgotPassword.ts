import type { ApiError } from "@/api";
import type { ForgotPasswordFormTypes } from "../schemas/forgot-password.schema";
import type { ForgotPasswordResponse } from "../types/forgot-password.types";
import { forgotPasswordApi } from "../api/forgot-password.api";
import { useMutation } from "@tanstack/react-query";

type UseForgotPasswordOptions = {
  onSuccess?: (
    data: ForgotPasswordResponse,
    variables: ForgotPasswordFormTypes,
  ) => void;
  onError?: (error: ApiError, variables: ForgotPasswordFormTypes) => void;
};

export const useForgotPassword = (options?: UseForgotPasswordOptions) => {
  return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordFormTypes>(
    {
      mutationFn: forgotPasswordApi,

      onSuccess: (response, variables) => {
        options?.onSuccess?.(response, variables);
      },

      onError: (error, variables) => {
        options?.onError?.(error, variables);
      },
    },
  );
};
