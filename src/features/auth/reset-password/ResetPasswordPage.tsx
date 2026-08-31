import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-fields/FormInput";
import { Typography } from "@/components/ui/shared/Typography";
import { useResetFlowStore } from "@/store/useResetFlowStore";
import { useResetPassword } from "./hooks/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordFormTypes,
} from "./schemas/reset-password.schema";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const resetToken = useResetFlowStore((state) => state.resetToken);
  const clearResetFlow = useResetFlowStore((state) => state.clearResetFlow);

  // Guard: If user visits /auth/reset-password directly without a token in store, redirect to login
  useEffect(() => {
    if (!resetToken) {
      navigate("/auth/login", { replace: true });
    }
  }, [resetToken, navigate]);

  const {
    mutate: resetPassword,
    isPending,
    error: apiError,
  } = useResetPassword({
    onSuccess: (response) => {
      // 1. Wipe temporary reset flow store & purge sessionStorage
      clearResetFlow();

      // 2. Toast success & return to login screen
      toast.success(
        response.message || "Password reset successfully! Please sign in.",
      );
      navigate("/auth/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset password.");
    },
  });

  const form = useForm<ResetPasswordFormTypes>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: ResetPasswordFormTypes) => {
    resetPassword({
      resetToken,
      newPassword: data.newPassword,
    });
  };

  return (
    <div
      data-testid="reset-password-page"
      className="w-full max-w-md space-y-8"
    >
      <div className="space-y-1.5">
        <Typography
          variant="h1"
          className="text-3xl lg:text-4xl font-bold text-sidebar-bg"
        >
          Create new password
        </Typography>
        <Typography variant="muted" className="text-text-secondary text-sm">
          Enter your new password below to complete the reset process.
        </Typography>
      </div>

      {apiError && (
        <div className="p-4 bg-status-danger-bg border border-status-danger-text/30 rounded-[7px] animate-in fade-in slide-in-from-top-1">
          <Typography
            variant="caption"
            className="text-status-danger-text font-medium text-xs"
          >
            {apiError.message || "Failed to reset password. Please try again."}
          </Typography>
        </div>
      )}

      <FormProvider {...form}>
        <form
          data-testid="reset-password-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <div className="space-y-1">
            <FormInput<ResetPasswordFormTypes>
              name="newPassword"
              label="New password"
              type="password"
              placeholder="••••••••••••"
            />
            <Typography
              variant="muted"
              className="text-xs text-text-secondary ml-0.5"
            >
              Use at least 8 characters.
            </Typography>
          </div>

          <FormInput<ResetPasswordFormTypes>
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            placeholder="••••••••••••"
          />

          <Button
            type="submit"
            data-testid="reset-password-submit-button"
            variant="primary"
            disabled={isPending}
            className="w-full h-11 rounded-[7px]"
          >
            {isPending ? "Resetting password..." : "Reset password"}
          </Button>

          <div className="text-center pt-2">
            <Typography
              variant="caption"
              className="text-text-secondary text-xs"
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  clearResetFlow();
                  navigate("/auth/login", { replace: true });
                }}
                className="text-brand-primary font-semibold hover:underline cursor-pointer"
              >
                Back to sign in
              </a>
            </Typography>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
