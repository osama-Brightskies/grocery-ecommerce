import { useResetFlowStore } from "@/store/useResetFlowStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyOtp } from "./hooks/useVerifyOtp";
import { toast } from "sonner";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyOtpSchema,
  type VerifyOtpFormTypes,
} from "./schemas/verify-otp.schema";
import { Typography } from "@/components/ui/shared/Typography";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "@/components/ui/button";
import { ResendCodeLink } from "./components/ResendCodeLink";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const resetEmail = useResetFlowStore((state) => state.resetEmail);
  const setResetToken = useResetFlowStore((state) => state.setResetToken);

  // Guard: If user visits /auth/verify-otp directly without an email in store, redirect to forgot-password
  useEffect(() => {
    if (!resetEmail) {
      navigate("/auth/forgot-password");
    }
  }, [resetEmail, navigate]);

  const {
    mutate: verifyOtp,
    isPending,
    error: apiError,
  } = useVerifyOtp({
    onSuccess: (response) => {
      toast.success(response.message || "Code verified successfully!");

      const token =
        typeof response.data === "string"
          ? response.data
          : response.data?.resetToken || "";

      // 1. Save resetToken to Zustand store (persisted in sessionStorage)
      setResetToken(token);

      // 2. Navigate to Reset Password screen
      navigate("/auth/reset-password");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid or expired verification code.");
    },
  });

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
            {resetEmail || "your email address"}
          </span>
          .
        </Typography>
      </div>

      {/* Red Error Alert */}
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

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-8"
        >
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
            <ResendCodeLink email={resetEmail} initialSeconds={120} />

            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/forgot-password");
                }}
                className="text-brand-primary text-xs font-semibold hover:underline cursor-pointer"
              >
                Back to reset email
              </a>
            </div>

            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/login");
                }}
                className="text-text-secondary text-xs font-medium hover:text-sidebar-bg hover:underline cursor-pointer"
              >
                Remembered your password?{" "}
                <span className="text-brand-primary font-semibold">
                  Sign in
                </span>
              </a>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
