import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "../../../../api";
import { resendEmailApi, verifyOtpApi } from "../api/verify-otp.api";
import type { VerifyOtpFormTypes } from "../schemas/verify-otp.schema";
import type { VerifyOtpResponse } from "../types/verify-otp.types";

type UseVerifyOtpOptions = {
  onSuccessCallback?: (resetToken: string) => void;
};

export const useVerifyOtp = (options?: UseVerifyOtpOptions) => {
  return useMutation<VerifyOtpResponse, ApiError, VerifyOtpFormTypes>({
    mutationFn: verifyOtpApi,

    onSuccess: (response) => {
      toast.success(response.message || "Code verified successfully!");

      // Extract resetToken from string or data object
      const token =
        typeof response.data === "string"
          ? response.data
          : response.data?.resetToken || "";

      // Delay navigation by 1.5s for user to read toast
      setTimeout(() => {
        options?.onSuccessCallback?.(token);
      }, 1500);
    },

    onError: (error) => {
      toast.error(error.message || "Invalid or expired verification code.");
    },
  });
};

// Resend Email Hook
export const useResendCode = () => {
  return useMutation<unknown, ApiError, string>({
    mutationFn: resendEmailApi,
    onSuccess: () => {
      toast.success("A new verification code has been sent to your email!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend code.");
    },
  });
};
