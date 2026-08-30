import { ApiError, http } from "@/api";
import type { LoginFormTypes } from "../schemas/login.schema";
import type { LoginResponse } from "../types/login.types";

export const loginApi = async (credentials: LoginFormTypes) => {
  const response = await http.post<LoginResponse>(
    "/api/auth/login",
    credentials,
  );

  // Role Guard: 1 = Admin, 0 = Regular User
  if (response.data?.role !== 1) {
    throw new ApiError("Access denied. Admin privileges required.", 403);
  }

  return response;
};
