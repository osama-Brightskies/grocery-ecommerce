import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserRole } from "@/store/types/authStore.types";
import {
  getUserActivitiesApi,
  getUserByIdApi,
  getUsersApi,
  updateUserApi,
} from "../api/users.api";
import { useGetUserActivities } from "../hooks/useGetUserActivities";
import { useGetUserDetail } from "../hooks/useGetUserDetail";
import { useGetUsers } from "../hooks/useGetUsers";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { updateUserSchema } from "../schemas/user.schema";

vi.mock("../api/users.api", () => ({
  getUsersApi: vi.fn(),
  getUserByIdApi: vi.fn(),
  getUserActivitiesApi: vi.fn(),
  updateUserApi: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const user = {
  guid: "user-123",
  firstName: "Mona",
  lastName: "Ali",
  email: "mona@example.com",
  phoneNumber: "+201234567890",
  role: UserRole.User,
  isActive: true,
  createdAt: "2026-08-20T10:00:00Z",
};

describe("users query hooks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads a paginated users request", async () => {
    const response = {
      success: true,
      statusCode: 200,
      message: "ok",
      data: {
        data: [user],
        pagination: {
          currentPage: 2,
          pageSize: 5,
          totalCount: 6,
          totalPages: 2,
          hasNext: false,
          hasPrevious: true,
        },
      },
    };
    vi.mocked(getUsersApi).mockResolvedValue(response);

    const { result } = renderHook(() => useGetUsers({ pageNumber: 2, pageSize: 5 }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getUsersApi).toHaveBeenCalledWith({ pageNumber: 2, pageSize: 5 });
    expect(result.current.data).toEqual(response);
  });

  it("does not load user detail without an id", () => {
    const { result } = renderHook(() => useGetUserDetail(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(getUserByIdApi).not.toHaveBeenCalled();
  });

  it("loads activities for the selected user", async () => {
    const response = { success: true, statusCode: 200, message: "ok", data: [] };
    vi.mocked(getUserActivitiesApi).mockResolvedValue(response);

    const { result } = renderHook(() => useGetUserActivities("user-123"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getUserActivitiesApi).toHaveBeenCalledWith("user-123");
  });
});

describe("useUpdateUser", () => {
  it("passes the user id and payload to the update API", async () => {
    const payload = {
      firstName: "Mona",
      lastName: "Ahmed",
      phoneNumber: "+201111111111",
      isActive: true,
    };
    const response = {
      success: true,
      statusCode: 200,
      message: "updated",
      data: { ...user, ...payload },
    };
    vi.mocked(updateUserApi).mockResolvedValue(response);

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.mutate({ userId: "user-123", payload }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateUserApi).toHaveBeenCalledWith("user-123", payload);
  });
});

describe("updateUserSchema", () => {
  it("accepts a valid user update", () => {
    expect(
      updateUserSchema.safeParse({
        firstName: "Mona",
        lastName: "Ali",
        phoneNumber: "+20 123-456-789",
      }).success,
    ).toBe(true);
  });

  it("rejects missing names and an invalid phone number", () => {
    const result = updateUserSchema.safeParse({
      firstName: "",
      lastName: "",
      phoneNumber: "phone",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "First name is required",
        "Last name is required",
        "Invalid phone number format",
      ]);
    }
  });
});
