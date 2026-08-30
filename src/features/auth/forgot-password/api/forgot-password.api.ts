import { http } from "@/api";
import type { ForgotPasswordFormTypes } from "../schemas/forgot-password.schema";
import type { ForgotPasswordResponse } from "../types/forgot-password.types";

export const forgotPasswordApi = (data: ForgotPasswordFormTypes) => {
  return http.post<ForgotPasswordResponse>("/api/auth/forgot-password", data);
};
