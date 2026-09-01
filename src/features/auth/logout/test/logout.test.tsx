import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { REFRESH_TOKEN_COOKIE } from "@/api";
import { logoutApi } from "../api/logout.api";
import { useLogout } from "../hooks/useLogout";

vi.mock("../api/logout.api", () => ({
  logoutApi: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useLogout", () => {
  afterEach(() => {
    vi.clearAllMocks();
    Cookies.remove(REFRESH_TOKEN_COOKIE);
  });

  it("passes the refresh cookie to the logout API", async () => {
    Cookies.set(REFRESH_TOKEN_COOKIE, "refresh-token");
    vi.mocked(logoutApi).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.mutate());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(logoutApi).toHaveBeenCalledWith("refresh-token");
  });

  it("uses an empty token when no refresh cookie exists", async () => {
    vi.mocked(logoutApi).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.mutate());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(logoutApi).toHaveBeenCalledWith("");
  });
});
