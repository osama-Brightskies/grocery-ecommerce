import { z } from "zod";

export const verifyOtpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "Verification code must be exactly 6 digits"),
});

export type VerifyOtpFormTypes = z.infer<typeof verifyOtpSchema>;
