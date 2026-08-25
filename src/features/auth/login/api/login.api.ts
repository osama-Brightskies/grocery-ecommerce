import { http } from "../../../../api";
import type { LoginFormTypes } from "../schemas/login.schema";
import type { LoginResponse } from "../types/login.types";

export const loginApi = (credentials: LoginFormTypes) => {
  return http.post<LoginResponse>("/api/auth/login", credentials);
};
