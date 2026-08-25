import { http } from "../../../../api";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password.types";

export const resetPasswordApi = (payload: ResetPasswordRequest) => {
  return http.post<ResetPasswordResponse>("/api/auth/reset-password", payload);
};
