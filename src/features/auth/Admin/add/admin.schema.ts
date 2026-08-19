import { z } from "zod";

export const createAdminSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email address is required")
      .email({ message: "Please enter a valid email address" }),

    // Birth Date Validation (Must be in the past)
    birthDate: z.coerce
      .date({
        message: "Birth date is required",
      })
      .refine((date) => date < new Date(), {
        message: "Birth date must be in the past",
      }),

    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .regex(/^[^\s]+$/, "Password cannot contain spaces"),

    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateAdminFormTypes = z.infer<typeof createAdminSchema>;
