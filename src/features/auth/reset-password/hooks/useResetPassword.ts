import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "../../../../api";
import { resetPasswordApi } from "../api/reset-password.api";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password.types";

type UseResetPasswordOptions = {
  onSuccessCallback?: () => void;
};

export const useResetPassword = (options?: UseResetPasswordOptions) => {
  return useMutation<ResetPasswordResponse, ApiError, ResetPasswordRequest>({
    mutationFn: resetPasswordApi,

    onSuccess: (response) => {
      toast.success(
        response.message || "Password reset successfully! Please sign in.",
      );

      // Delay navigation back to login by 1.5s
      setTimeout(() => {
        options?.onSuccessCallback?.();
      }, 1500);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to reset password.");
    },
  });
};
