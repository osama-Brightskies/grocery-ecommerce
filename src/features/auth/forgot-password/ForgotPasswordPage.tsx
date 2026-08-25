import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { FormInput } from "../../../components/ui/form-fields/FormInput";
import { useForgotPassword } from "./hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormTypes,
} from "./schemas/forgot-password.schema";
import { Typography } from "@/components/ui/shared/Typography";

type ForgotPasswordPageProps = {
  onSuccess: (email: string) => void;
  onBackToLogin: () => void;
};

export default function ForgotPasswordPage({
  onSuccess,
  onBackToLogin,
}: ForgotPasswordPageProps) {
  const {
    mutate: sendResetLink,
    isPending,
    error: apiError,
  } = useForgotPassword({
    onSuccessCallback: onSuccess,
  });

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: ForgotPasswordFormTypes) => {
    sendResetLink(data);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <Typography
          variant="h1"
          className="text-3xl lg:text-4xl font-bold text-sidebar-bg"
        >
          Reset your password
        </Typography>
        <Typography variant="muted" className="text-text-secondary text-sm">
          Enter your email and we will send you a reset link.
        </Typography>
      </div>

      {/* Server Error Alert */}
      {apiError && (
        <div className="p-4 bg-status-danger-bg border border-status-danger-text/30 rounded-[7px] animate-in fade-in slide-in-from-top-1">
          <Typography
            variant="caption"
            className="text-status-danger-text font-medium text-xs"
          >
            {apiError.message || "Failed to send reset link. Please try again."}
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
          <FormInput<ForgotPasswordFormTypes>
            name="email"
            label="Email address"
            type="email"
            placeholder="email@example.com"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full h-11 rounded-[7px]"
          >
            {isPending ? "Sending link..." : "Send reset link"}
          </Button>

          {/* Back to Sign In Link */}
          <div className="text-center">
            <Typography
              variant="caption"
              className="text-text-secondary text-xs"
            >
              Remember your password?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToLogin();
                }}
                className="text-brand-primary font-semibold hover:underline ml-1 cursor-pointer"
              >
                Back to sign in
              </a>
            </Typography>
          </div>
        </form>
      </FormProvider>

      {/* Info Box */}
      <div className="p-5 bg-surface-mint/80 rounded-2xl border border-brand-primary/10">
        <Typography
          variant="body"
          className="text-sidebar-bg font-medium text-sm leading-relaxed"
        >
          A 6-digit verification code will be sent to your email address if an
          account exists under that address.
        </Typography>
      </div>
    </div>
  );
}
