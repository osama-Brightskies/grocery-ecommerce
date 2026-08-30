import type { ApiError } from "@/api";
import type { VerifyOtpFormTypes } from "../schemas/verify-otp.schema";
import type { VerifyOtpResponse } from "../types/verify-otp.types";
import { useMutation } from "@tanstack/react-query";
import { resendEmailApi, verifyOtpApi } from "../api/verify-otp.api";

type UseVerifyOtpOptions = {
  onSuccess?: (data: VerifyOtpResponse, variables: VerifyOtpFormTypes) => void;
  onError?: (error: ApiError, variables: VerifyOtpFormTypes) => void;
};

export const useVerifyOtp = (options?: UseVerifyOtpOptions) => {
  return useMutation<VerifyOtpResponse, ApiError, VerifyOtpFormTypes>({
    mutationFn: verifyOtpApi,

    onSuccess: (response, variables) => {
      options?.onSuccess?.(response, variables);
    },

    onError: (error, variables) => {
      options?.onError?.(error, variables);
    },
  });
};

type UseResendCodeOptions = {
  onSuccess?: (data: unknown, variables: string) => void;
  onError?: (error: ApiError, variables: string) => void;
};

export const useResendCode = (options?: UseResendCodeOptions) => {
  return useMutation<unknown, ApiError, string>({
    mutationFn: resendEmailApi,

    onSuccess: (data, variables) => {
      options?.onSuccess?.(data, variables);
    },

    onError: (error, variables) => {
      options?.onError?.(error, variables);
    },
  });
};
