import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, http } from "@/api";
import { forgotPasswordApi } from "../forgot-password/api/forgot-password.api";
import { loginApi } from "../login/api/login.api";
import { logoutApi } from "../logout/api/logout.api";
import { resetPasswordApi } from "../reset-password/api/reset-password.api";
import {
  resendEmailApi,
  verifyOtpApi,
} from "../verify-otp/api/verify-otp.api";
import { UserRole } from "@/store/types/authStore.types";

const adminResponse = {
  success: true,
  statusCode: 200,
  message: "Signed in",
  data: {
    accessToken: "access-token",
    accessTokenExpiresAtUtc: "2030-01-01T00:15:00.000Z",
    refreshToken: "refresh-token",
    refreshTokenExpiresAtUtc: "2030-01-08T00:00:00.000Z",
    role: UserRole.Admin,
    userId: "admin-1",
  },
};

describe("auth API contracts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts login credentials and accepts an administrator", async () => {
    const credentials = { email: "admin@example.com", password: "password" };
    vi.spyOn(http, "post").mockResolvedValue(adminResponse);

    await expect(loginApi(credentials)).resolves.toEqual(adminResponse);
    expect(http.post).toHaveBeenCalledWith("/api/auth/login", credentials);
  });

  it("rejects a non-administrator login", async () => {
    vi.spyOn(http, "post").mockResolvedValue({
      ...adminResponse,
      data: { ...adminResponse.data, role: UserRole.User },
    });

    await expect(
      loginApi({ email: "user@example.com", password: "password" }),
    ).rejects.toEqual(
      new ApiError("Access denied. Admin privileges required.", 403),
    );
  });

  it("posts a forgot-password request", async () => {
    const payload = { email: "user@example.com" };
    vi.spyOn(http, "post").mockResolvedValue({ message: "sent" });

    await forgotPasswordApi(payload);
    expect(http.post).toHaveBeenCalledWith(
      "/api/auth/forgot-password",
      payload,
    );
  });

  it("posts a verification code", async () => {
    const payload = { code: "123456" };
    vi.spyOn(http, "post").mockResolvedValue({ message: "verified" });

    await verifyOtpApi(payload);
    expect(http.post).toHaveBeenCalledWith(
      "/api/auth/verify-reset-code",
      payload,
    );
  });

  it("adds a unique idempotency key when resending a code", async () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "123e4567-e89b-12d3-a456-426614174000",
    );
    vi.spyOn(http, "post").mockResolvedValue(undefined);

    await resendEmailApi("user@example.com");
    expect(http.post).toHaveBeenCalledWith(
      "/api/auth/resend-email",
      { email: "user@example.com", purpose: 1 },
      {
        headers: {
          IdempotencyKey: "123e4567-e89b-12d3-a456-426614174000",
        },
      },
    );
  });

  it("posts the reset token and new password", async () => {
    const payload = { resetToken: "reset-token", newPassword: "password123" };
    vi.spyOn(http, "post").mockResolvedValue({ message: "reset" });

    await resetPasswordApi(payload);
    expect(http.post).toHaveBeenCalledWith(
      "/api/auth/reset-password",
      payload,
    );
  });

  it("posts the refresh token on logout", async () => {
    vi.spyOn(http, "post").mockResolvedValue(undefined);

    await logoutApi("refresh-token");
    expect(http.post).toHaveBeenCalledWith("/api/auth/logout", {
      refreshToken: "refresh-token",
    });
  });
});
