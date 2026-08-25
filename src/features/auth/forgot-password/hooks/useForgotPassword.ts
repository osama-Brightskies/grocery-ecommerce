import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "../../../../api";
import { forgotPasswordApi } from "../api/forgot-password.api";
import type { ForgotPasswordFormTypes } from "../schemas/forgot-password.schema";
import type { ForgotPasswordResponse } from "../types/forgot-password.types";

type UseForgotPasswordOptions = {
  onSuccessCallback?: (email: string) => void;
};

export const useForgotPassword = (options?: UseForgotPasswordOptions) => {
  return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordFormTypes>(
    {
      mutationFn: forgotPasswordApi,

      onSuccess: (response, variables) => {
        toast.success(
          response.message ||
            "A verification code has been sent to your email!",
        );

        setTimeout(() => {
          options?.onSuccessCallback?.(variables.email);
        }, 1500);
      },

      onError: (error) => {
        toast.error(error.message || "Failed to send reset link.");
      },
    },
  );
};
