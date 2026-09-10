import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserRole } from "@/store/types/authStore.types";
import UsersListPage from "../pages/UsersListPage";
import { useGetUsers } from "../hooks/useGetUsers";
import { useAuthStore } from "@/store/useAuthStore";
import { renderUsersPage } from "./test-utils";

// Mock Hooks & Components
vi.mock("../hooks/useGetUsers", () => ({ useGetUsers: vi.fn() }));
vi.mock("@/store/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("../components/EditUserSheet", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Edit user sheet</div> : null,
}));

const user = {
  guid: "user-123456789",
  firstName: "Mona",
  lastName: "Ali",
  email: "mona@example.com",
  phoneNumber: "+201234567890",
  role: UserRole.Admin,
  isActive: true,
  createdAt: "2026-08-20T10:00:00Z",
};

describe("UsersListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default auth store mock: Logged in as a DIFFERENT user so action buttons are enabled
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        user: { userId: "different-admin-id", role: UserRole.Admin },
        isAuthenticated: true,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      }),
    );
  });

  it("renders users and pagination information", () => {
    vi.mocked(useGetUsers).mockReturnValue({
      data: {
        data: {
          data: [user],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 1,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          },
        },
      },
      isLoading: false,
    } as ReturnType<typeof useGetUsers>);

    renderUsersPage(<UsersListPage />);

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByText("1 users")).toBeInTheDocument();
    expect(screen.getByText("Mona Ali")).toBeInTheDocument();
    expect(screen.getByText("mona@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Showing 1-1 of 1")).toBeInTheDocument();
  });

  it("shows the loading state", () => {
    vi.mocked(useGetUsers).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useGetUsers>);

    renderUsersPage(<UsersListPage />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("shows the empty state", () => {
    vi.mocked(useGetUsers).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useGetUsers>);

    renderUsersPage(<UsersListPage />);
    expect(screen.getByText("No records found.")).toBeInTheDocument();
  });

  it("navigates to the selected user's detail page", () => {
    vi.mocked(useGetUsers).mockReturnValue({
      data: {
        data: {
          data: [user],
          pagination: { totalCount: 1, totalPages: 1 },
        },
      },
      isLoading: false,
    } as ReturnType<typeof useGetUsers>);

    renderUsersPage(<UsersListPage />);
    fireEvent.click(screen.getByTitle("View user details"));

    expect(screen.getByText("User detail destination")).toBeInTheDocument();
  });

  it("opens the edit user sheet when clicking the edit button", () => {
    vi.mocked(useGetUsers).mockReturnValue({
      data: {
        data: {
          data: [user],
          pagination: { totalCount: 1, totalPages: 1 },
        },
      },
      isLoading: false,
    } as ReturnType<typeof useGetUsers>);

    renderUsersPage(<UsersListPage />);
    fireEvent.click(screen.getByTitle("Edit user"));

    expect(screen.getByText("Edit user sheet")).toBeInTheDocument();
  });

  it("disables actions and shows 'You' badge for the current logged-in user", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        user: { userId: user.guid, role: UserRole.Admin },
        isAuthenticated: true,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      }),
    );

    vi.mocked(useGetUsers).mockReturnValue({
      data: {
        data: {
          data: [user],
          pagination: { totalCount: 1, totalPages: 1 },
        },
      },
      isLoading: false,
    } as ReturnType<typeof useGetUsers>);

    renderUsersPage(<UsersListPage />);

    // Verify the "You" badge appears
    expect(screen.getByText("You")).toBeInTheDocument();

    // Verify the interactive buttons are NOT present (replaced by disabled icon)
    expect(screen.queryByTitle("Edit user")).not.toBeInTheDocument();
    expect(screen.queryByTitle("View user details")).not.toBeInTheDocument();
  });
});
