import axios from "axios";
import Cookies from "js-cookie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { executeSilentRefresh } from "../api/refresh.api";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/store/types/authStore.types";

const refreshedSession = {
  accessToken: "new-access-token",
  accessTokenExpiresAtUtc: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  refreshToken: "new-refresh-token",
  refreshTokenExpiresAtUtc: "2030-01-08T00:00:00.000Z",
  role: UserRole.Admin,
  userId: "user-1",
};

const refreshResponse = {
  data: {
    success: true,
    statusCode: 200,
    message: "Token refreshed",
    data: refreshedSession,
  },
};

describe("executeSilentRefresh", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    useAuthStore.getState().clearAuth();
    Cookies.remove(AUTH_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);
  });

  it("returns false when no refresh token is available", async () => {
    const postSpy = vi.spyOn(axios, "post");

    expect(await executeSilentRefresh()).toBe(false);
    expect(postSpy).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("stores refreshed tokens and updates the auth state", async () => {
    Cookies.set(REFRESH_TOKEN_COOKIE, "old-refresh-token");
    vi.spyOn(axios, "post").mockResolvedValue(refreshResponse);
    const timerSpy = vi.spyOn(globalThis, "setTimeout");

    await expect(executeSilentRefresh()).resolves.toBe(true);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/auth\/refresh$/),
      {
        refreshToken: "old-refresh-token",
      },
    );
    expect(Cookies.get(AUTH_TOKEN_COOKIE)).toBe("new-access-token");
    expect(Cookies.get(REFRESH_TOKEN_COOKIE)).toBe("new-refresh-token");
    expect(useAuthStore.getState()).toMatchObject({
      isAuthenticated: true,
      user: { userId: "user-1", role: UserRole.Admin },
    });
    expect(localStorage.getItem("BigCart_auth_session")).not.toBeNull();
    const scheduledDelay = timerSpy.mock.calls[0]?.[1];
    expect(scheduledDelay).toBeGreaterThanOrEqual(779_000);
    expect(scheduledDelay).toBeLessThanOrEqual(13 * 60 * 1000);
  });

  it("keeps the current refresh token when the API does not rotate it", async () => {
    Cookies.set(REFRESH_TOKEN_COOKIE, "current-refresh-token");
    vi.spyOn(axios, "post").mockResolvedValue({
      ...refreshResponse,
      data: {
        ...refreshResponse.data,
        data: { ...refreshedSession, refreshToken: "" },
      },
    });

    await expect(executeSilentRefresh()).resolves.toBe(true);

    expect(Cookies.get(REFRESH_TOKEN_COOKIE)).toBe("current-refresh-token");
  });

  it("shares one request between simultaneous refresh attempts", async () => {
    Cookies.set(REFRESH_TOKEN_COOKIE, "old-refresh-token");
    let resolveRequest!: (value: typeof refreshResponse) => void;
    const request = new Promise<typeof refreshResponse>((resolve) => {
      resolveRequest = resolve;
    });
    const postSpy = vi.spyOn(axios, "post").mockReturnValue(request);

    const firstRefresh = executeSilentRefresh();
    const secondRefresh = executeSilentRefresh();
    resolveRequest(refreshResponse);

    await expect(Promise.all([firstRefresh, secondRefresh])).resolves.toEqual([
      true,
      true,
    ]);
    expect(postSpy).toHaveBeenCalledTimes(1);
  });

  it("clears authentication when refresh fails", async () => {
    useAuthStore.setState({
      user: { userId: "user-1", role: UserRole.Admin },
      isAuthenticated: true,
    });
    Cookies.set(AUTH_TOKEN_COOKIE, "expired-access-token");
    Cookies.set(REFRESH_TOKEN_COOKIE, "invalid-refresh-token");
    vi.spyOn(axios, "post").mockRejectedValue(new Error("Unauthorized"));
    const removeSpy = vi.spyOn(Cookies, "remove");

    await expect(executeSilentRefresh()).resolves.toBe(false);

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
    });
    expect(Cookies.get(AUTH_TOKEN_COOKIE)).toBeUndefined();
    expect(Cookies.get(REFRESH_TOKEN_COOKIE)).toBeUndefined();
    expect(removeSpy).toHaveBeenCalledWith(AUTH_TOKEN_COOKIE, { path: "/" });
    expect(removeSpy).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE, { path: "/" });
  });
});
