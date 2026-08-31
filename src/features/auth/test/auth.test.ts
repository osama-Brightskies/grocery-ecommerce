import Cookies from "js-cookie";
import { afterEach, describe, expect, it } from "vitest";
import { executeSilentRefresh } from "../api/refresh.api";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/api";

describe("executeSilentRefresh", () => {
  afterEach(() => {
    Cookies.remove(AUTH_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);
  });

  it("returns false when no refresh token is available", async () => {
    expect(await executeSilentRefresh()).toBe(false);
  });
});
