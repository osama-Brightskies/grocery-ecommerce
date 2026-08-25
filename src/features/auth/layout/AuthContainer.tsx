import { useState } from "react";
import AuthLayout from "./AuthLayout";
import LoginPage from "../login/LoginPage";
import ForgotPasswordPage from "../forgot-password/ForgotPasswordPage";
import VerifyOtpPage from "../verify-otp/VerifyOtpPage";
import ResetPasswordPage from "../reset-password/ResetPasswordPage";

export type AuthStep =
  "login" | "forgot-password" | "verify-otp" | "reset-password";

export default function AuthContainer() {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");

  // Guards: Prevent accessing OTP or Reset Password without previous step data
  if (authStep === "verify-otp" && !resetEmail) {
    setAuthStep("forgot-password");
  }
  if (authStep === "reset-password" && !resetToken) {
    setAuthStep("forgot-password");
  }

  // Left Banner Quotes matching Figma per step
  const leftQuote =
    authStep === "forgot-password"
      ? "“Fresh products. Clear operations.”"
      : "“Keep your shelves fresh and your data even fresher.”";

  return (
    <AuthLayout quote={leftQuote}>
      {/* STEP 1: LOGIN */}
      {authStep === "login" && (
        <LoginPage onNavigateToForgot={() => setAuthStep("forgot-password")} />
      )}

      {/* STEP 2: FORGOT PASSWORD (Enter Email) */}
      {authStep === "forgot-password" && (
        <ForgotPasswordPage
          onSuccess={(email) => {
            setResetEmail(email);
            setAuthStep("verify-otp"); // Advance to OTP
          }}
          onBackToLogin={() => setAuthStep("login")}
        />
      )}

      {/* STEP 3: VERIFY OTP (Enter 6-digit Code) */}
      {authStep === "verify-otp" && (
        <VerifyOtpPage
          email={resetEmail}
          onSuccess={(token) => {
            setResetToken(token); // Store resetToken from backend
            setAuthStep("reset-password"); // Advance to Reset Password
          }}
          onBackToEmail={() => {
            setResetEmail(""); // Clear email on back
            setAuthStep("forgot-password");
          }}
        />
      )}

      {/* STEP 4: RESET PASSWORD (Create New Password) */}
      {authStep === "reset-password" && (
        <ResetPasswordPage
          resetToken={resetToken}
          onSuccess={() => {
            // Reset flow state and return user to Login page
            setResetEmail("");
            setResetToken("");
            setAuthStep("login");
          }}
          onBackToLogin={() => {
            setResetEmail("");
            setResetToken("");
            setAuthStep("login");
          }}
        />
      )}
    </AuthLayout>
  );
}
