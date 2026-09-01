import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserRole } from "@/store/types/authStore.types";
import UserDetailPage from "../pages/UserDetailPage";
import { useGetUserDetail } from "../hooks/useGetUserDetail";
import { useGetUserActivities } from "../hooks/useGetUserActivities";
import { renderUsersPage } from "./test-utils";

vi.mock("../hooks/useGetUserDetail", () => ({ useGetUserDetail: vi.fn() }));
vi.mock("../hooks/useGetUserActivities", () => ({
  useGetUserActivities: vi.fn(),
}));
vi.mock("../components/EditUserSheet", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Edit user sheet</div> : null,
}));

const user = {
  guid: "12345678-abcd-efgh-ijkl-123456789012",
  firstName: "Mona",
  lastName: "Ali",
  email: "mona@example.com",
  phoneNumber: "+201234567890",
  role: UserRole.User,
  isActive: true,
  createdAt: "2026-08-20T10:00:00Z",
};

describe("UserDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetUserActivities).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    } as ReturnType<typeof useGetUserActivities>);
  });

  it("renders the loading state", () => {
    vi.mocked(useGetUserDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetUserDetail>);

    renderUsersPage(<UserDetailPage />, "/users/user-123", "/users/:userId");
    expect(screen.getByText("Loading user profile...")).toBeInTheDocument();
  });

  it("renders a graceful not-found state and returns to the list", () => {
    vi.mocked(useGetUserDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useGetUserDetail>);

    renderUsersPage(<UserDetailPage />, "/users/missing", "/users/:userId");
    expect(screen.getByRole("heading", { name: "User not found" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /return to user list/i }));
    expect(screen.getByText("User list destination")).toBeInTheDocument();
  });

  it("renders profile and activity details and opens the edit sheet", () => {
    vi.mocked(useGetUserDetail).mockReturnValue({
      data: { data: user },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetUserDetail>);
    vi.mocked(useGetUserActivities).mockReturnValue({
      data: {
        data: [
          {
            id: "activity-1",
            action: "Placed order",
            targetName: "Order #42",
            timestamp: "2026-08-21T11:00:00Z",
          },
        ],
      },
      isLoading: false,
    } as ReturnType<typeof useGetUserActivities>);

    renderUsersPage(<UserDetailPage />, "/users/user-123", "/users/:userId");

    expect(screen.getByRole("heading", { name: "Mona Ali" })).toBeInTheDocument();
    expect(screen.getAllByText("User").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getByText("Placed order")).toBeInTheDocument();
    expect(screen.getByText("Order #42")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /edit user/i }));
    expect(screen.getByText("Edit user sheet")).toBeInTheDocument();
  });
});
