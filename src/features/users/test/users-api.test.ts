import { afterEach, describe, expect, it, vi } from "vitest";
import { http } from "@/api";
import {
  getUserActivitiesApi,
  getUserByIdApi,
  getUsersApi,
  updateUserApi,
} from "../api/users.api";

describe("users API contracts", () => {
  afterEach(() => vi.restoreAllMocks());

  it("maps list pagination to the API parameter casing", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);

    await getUsersApi({ pageNumber: 2, pageSize: 25 });

    expect(http.get).toHaveBeenCalledWith("/api/users", {
      params: { PageNumber: 2, PageSize: 25 },
    });
  });

  it("gets one user by id", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);

    await getUserByIdApi("user-123");

    expect(http.get).toHaveBeenCalledWith("/api/users/user-123");
  });

  it("updates one user by id", async () => {
    const payload = {
      firstName: "Mona",
      lastName: "Ali",
      phoneNumber: "+201234567890",
      isActive: false,
    };
    vi.spyOn(http, "put").mockResolvedValue(undefined);

    await updateUserApi("user-123", payload);

    expect(http.put).toHaveBeenCalledWith("/api/users/user-123", payload);
  });

  it("gets activities filtered by user id", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);

    await getUserActivitiesApi("user-123");

    expect(http.get).toHaveBeenCalledWith("/api/user-activities", {
      params: { userId: "user-123" },
    });
  });

  it("gets all activities without an undefined query parameter", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);

    await getUserActivitiesApi();

    expect(http.get).toHaveBeenCalledWith("/api/user-activities", {
      params: undefined,
    });
  });
});
