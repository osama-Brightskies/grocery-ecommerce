import Cookies from "js-cookie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, AUTH_TOKEN_COOKIE } from "@/api";
import { executeSilentRefresh } from "../api/refresh.api";

const axiosMocks = vi.hoisted(() => {
  const requestUse = vi.fn();
  const responseUse = vi.fn();
  const client = Object.assign(vi.fn(), {
    delete: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: requestUse },
      response: { use: responseUse },
    },
    patch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  });

  return {
    client,
    create: vi.fn(() => client),
    requestUse,
    responseUse,
  };
});

vi.mock("axios", () => ({
  default: { create: axiosMocks.create },
}));

vi.mock("../api/refresh.api", () => ({
  executeSilentRefresh: vi.fn(),
}));

type RequestConfig = {
  _retry?: boolean;
  headers: Record<string, string>;
  url: string;
};

type ResponseError = Error & {
  config: RequestConfig;
  response?: { data?: unknown; status: number };
};

const requestInterceptor = axiosMocks.requestUse.mock.calls[0]?.[0] as (
  config: RequestConfig,
) => RequestConfig;

const responseErrorInterceptor = axiosMocks.responseUse.mock.calls[0]?.[1] as (
  error: ResponseError,
) => Promise<unknown>;

describe("auth HTTP interceptors", () => {
  afterEach(() => {
    vi.clearAllMocks();
    Cookies.remove(AUTH_TOKEN_COOKIE);
  });

  it("attaches the access token to outgoing requests", () => {
    Cookies.set(AUTH_TOKEN_COOKIE, "access-token");
    const config: RequestConfig = { headers: {}, url: "/api/products" };

    expect(requestInterceptor(config).headers.Authorization).toBe(
      "Bearer access-token",
    );
  });

  it("refreshes once and retries a failed authenticated request", async () => {
    Cookies.set(AUTH_TOKEN_COOKIE, "refreshed-access-token");
    vi.mocked(executeSilentRefresh).mockResolvedValue(true);
    const config: RequestConfig = { headers: {}, url: "/api/products" };
    const error = Object.assign(new Error("Unauthorized"), {
      config,
      response: { data: { message: "Unauthorized" }, status: 401 },
    });
    axiosMocks.client.mockResolvedValue({ data: "retried" });

    await expect(responseErrorInterceptor(error)).resolves.toEqual({
      data: "retried",
    });
    expect(executeSilentRefresh).toHaveBeenCalledTimes(1);
    expect(config._retry).toBe(true);
    expect(config.headers.Authorization).toBe("Bearer refreshed-access-token");
    expect(axiosMocks.client).toHaveBeenCalledWith(config);
  });

  it("does not start a refresh loop for login failures", async () => {
    const error = Object.assign(new Error("Invalid credentials"), {
      config: { headers: {}, url: "/api/auth/login" },
      response: {
        data: { detail: "Invalid credentials" },
        status: 401,
      },
    });

    await expect(responseErrorInterceptor(error)).rejects.toMatchObject({
      message: "Invalid credentials",
      status: 401,
    } satisfies Partial<ApiError>);
    expect(executeSilentRefresh).not.toHaveBeenCalled();
    expect(axiosMocks.client).not.toHaveBeenCalled();
  });

  it("returns the normalized original error when refresh fails", async () => {
    vi.mocked(executeSilentRefresh).mockResolvedValue(false);
    const error = Object.assign(new Error("Unauthorized"), {
      config: { headers: {}, url: "/api/products" },
      response: { data: { message: "Session expired" }, status: 401 },
    });

    await expect(responseErrorInterceptor(error)).rejects.toMatchObject({
      message: "Session expired",
      status: 401,
    } satisfies Partial<ApiError>);
    expect(axiosMocks.client).not.toHaveBeenCalled();
  });
});
