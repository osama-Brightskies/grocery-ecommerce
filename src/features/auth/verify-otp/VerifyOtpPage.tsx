import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../components/ui/input-otp";
import { useResendCode, useVerifyOtp } from "./hooks/useVerifyOtp";
import {
  verifyOtpSchema,
  type VerifyOtpFormTypes,
} from "./schemas/verify-otp.schema";
import { Typography } from "@/components/ui/shared/Typography";

type VerifyOtpPageProps = {
  email: string;
  onSuccess: (resetToken: string) => void;
  onBackToEmail: () => void;
};

export default function VerifyOtpPage({
  email,
  onSuccess,
  onBackToEmail,
}: VerifyOtpPageProps) {
  const {
    mutate: verifyOtp,
    isPending,
    error: apiError,
  } = useVerifyOtp({
    onSuccessCallback: onSuccess,
  });

  const { mutate: resendCode, isPending: isResending } = useResendCode();

  const form = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: VerifyOtpFormTypes) => {
    verifyOtp(data);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <Typography
          variant="h1"
          className="text-3xl lg:text-4xl font-bold text-sidebar-bg"
        >
          Enter verification code
        </Typography>
        <Typography variant="muted" className="text-text-secondary text-sm">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-sidebar-bg">
            {email || "your email address"}
          </span>
          .
        </Typography>
      </div>

      {/* Server Error Alert */}
      {apiError && (
        <div className="p-4 bg-status-danger-bg border border-status-danger-text/30 rounded-[7px] animate-in fade-in slide-in-from-top-1">
          <Typography
            variant="caption"
            className="text-status-danger-text font-medium text-xs"
          >
            {apiError.message || "Invalid code. Please check and try again."}
          </Typography>
        </div>
      )}

      {/* Form */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-8"
        >
          {/* Shadcn OTP Input Primitive */}
          <div className="flex justify-center">
            <Controller
              name="code"
              control={form.control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    <InputOTPSlot
                      index={0}
                      className="h-12 w-12 text-lg font-bold text-sidebar-bg border-border-input rounded-[7px]"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-12 w-12 text-lg font-bold text-sidebar-bg border-border-input rounded-[7px]"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-12 w-12 text-lg font-bold text-sidebar-bg border-border-input rounded-[7px]"
                    />
                    <InputOTPSlot
                      index={3}
                      className="h-12 w-12 text-lg font-bold text-sidebar-bg border-border-input rounded-[7px]"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-12 w-12 text-lg font-bold text-sidebar-bg border-border-input rounded-[7px]"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-12 w-12 text-lg font-bold text-sidebar-bg border-border-input rounded-[7px]"
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full h-11 rounded-[7px]"
          >
            {isPending ? "Verifying..." : "Verify code"}
          </Button>

          {/* Action Links */}
          <div className="space-y-4 text-center">
            {/* Resend Code Link */}
            <Typography
              variant="caption"
              className="text-text-secondary text-xs block"
            >
              Didn't receive the code?{" "}
              <button
                type="button"
                disabled={isResending}
                onClick={() => email && resendCode(email)}
                className="text-brand-primary font-semibold hover:underline ml-1 cursor-pointer disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend code"}
              </button>
            </Typography>

            {/* Back to Email / Forgot Password Link */}
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToEmail();
                }}
                className="text-brand-primary text-xs font-semibold hover:underline cursor-pointer"
              >
                Back to reset password
              </a>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
