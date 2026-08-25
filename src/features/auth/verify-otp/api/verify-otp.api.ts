import { http } from "../../../../api";
import type { VerifyOtpFormTypes } from "../schemas/verify-otp.schema";
import type { VerifyOtpResponse } from "../types/verify-otp.types";

export const verifyOtpApi = (data: VerifyOtpFormTypes) => {
  return http.post<VerifyOtpResponse>("/api/auth/verify-reset-code", data);
};

// Resend Email Endpoint (Requires IdempotencyKey header)
export const resendEmailApi = (email: string) => {
  return http.post(
    "/api/auth/resend-email",
    {
      email,
      purpose: 0,
    },
    {
      headers: {
        IdempotencyKey: crypto.randomUUID(),
      },
    },
  );
};
