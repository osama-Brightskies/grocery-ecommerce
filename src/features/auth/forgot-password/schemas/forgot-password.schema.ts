import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address").trim().toLowerCase(),
});

export type ForgotPasswordFormTypes = z.infer<typeof forgotPasswordSchema>;
