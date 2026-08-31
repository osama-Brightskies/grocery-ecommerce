import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useResendCode } from "../hooks/useVerifyOtp";
import { Typography } from "@/components/ui/shared/Typography";

type ResendCodeLinkProps = {
  email: string;
  initialSeconds?: number; // Default 120 seconds (2 minutes)
};

export function ResendCodeLink({
  email,
  initialSeconds = 120,
}: ResendCodeLinkProps) {
  const [countdown, setCountdown] = useState<number>(0);

  // Countdown Ticking Effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Format seconds into MM:SS (e.g. 120 -> 02:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const { mutate: resendCode, isPending: isResending } = useResendCode({
    onSuccess: () => {
      toast.success("A new verification code has been sent to your email!");
      setCountdown(initialSeconds); // Start 2-minute countdown timer on success
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend code.");
    },
  });

  const handleResend = () => {
    if (!email || countdown > 0 || isResending) return;
    resendCode(email);
  };

  return (
    <Typography variant="caption" className="text-text-secondary text-xs block">
      Didn't receive the code?{" "}
      <button
        type="button"
        data-testid="resend-code-button"
        disabled={countdown > 0 || isResending}
        onClick={handleResend}
        className="text-brand-primary font-semibold hover:underline ml-1 cursor-pointer disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
      >
        {isResending
          ? "Sending..."
          : countdown > 0
            ? `Resend code in ${formatTime(countdown)}`
            : "Resend code"}
      </button>
    </Typography>
  );
}
