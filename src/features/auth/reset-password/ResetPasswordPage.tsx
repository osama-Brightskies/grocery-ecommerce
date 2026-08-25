import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { FormInput } from "../../../components/ui/form-fields/FormInput";
import { useResetPassword } from "./hooks/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordFormTypes,
} from "./schemas/reset-password.schema";
import { Typography } from "@/components/ui/shared/Typography";

type ResetPasswordPageProps = {
  resetToken: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
};

export default function ResetPasswordPage({
  resetToken,
  onSuccess,
  onBackToLogin,
}: ResetPasswordPageProps) {
  const {
    mutate: resetPassword,
    isPending,
    error: apiError,
  } = useResetPassword({
    onSuccessCallback: onSuccess,
  });

  const form = useForm({
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
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
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

      {/* Server Error Display */}
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

      {/* Form */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* New Password */}
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

          {/* Confirm New Password */}
          <FormInput<ResetPasswordFormTypes>
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            placeholder="••••••••••••"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full h-11 rounded-[7px]"
          >
            {isPending ? "Resetting password..." : "Reset password"}
          </Button>

          {/* Back to Sign In Link */}
          <div className="text-center pt-2">
            <Typography
              variant="caption"
              className="text-text-secondary text-xs"
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToLogin();
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
