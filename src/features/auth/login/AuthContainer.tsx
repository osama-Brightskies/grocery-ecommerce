import { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import LoginPage from "../login/LoginPage";
// Future imports for tomorrow:
// import ForgotPasswordPage from "./forgot-password/ForgotPasswordPage";
// import VerifyOtpPage from "./verify-otp/VerifyOtpPage";
// import ResetPasswordPage from "./reset-password/ResetPasswordPage";

export type AuthStep =
  | "login"
  | "forgot-password"
  | "verify-otp"
  | "reset-password";

export default function AuthContainer() {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
//   const [resetEmail, setResetEmail] = useState<string>("");
//   const [resetToken, setResetToken] = useState<string>("");

  return (
    <AuthLayout>
      {/* STEP 1: LOGIN */}
      {authStep === "login" && (
        <LoginPage
          onNavigateToForgot={() => setAuthStep("forgot-password")}
        />
      )}

      {/* STEP 2: FORGOT PASSWORD (Tomorrow) */}
      {/* {authStep === "forgot-password" && ( ... )} */}

      {/* STEP 3: VERIFY OTP (Tomorrow) */}
      {/* {authStep === "verify-otp" && ( ... )} */}

      {/* STEP 4: RESET PASSWORD (Tomorrow) */}
      {/* {authStep === "reset-password" && ( ... )} */}
    </AuthLayout>
  );
}