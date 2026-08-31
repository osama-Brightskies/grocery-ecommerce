import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import DashboardPage from "../DashboardPage";
import { UserRole } from "@/store/types/authStore.types";
import { useAuthStore } from "@/store/useAuthStore";

describe("DashboardPage", () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it.each([
    {
      label: "administrator",
      user: { userId: "admin-1", role: UserRole.Admin },
      isAuthenticated: true,
      roleText: "Administrator (1)",
    },
    {
      label: "user",
      user: { userId: "user-1", role: UserRole.User },
      isAuthenticated: true,
      roleText: "User (0)",
    },
    {
      label: "anonymous",
      user: null,
      isAuthenticated: false,
      roleText: "N/A",
    },
  ])("renders the $label profile state", ({ user, isAuthenticated, roleText }) => {
    useAuthStore.setState({ user, isAuthenticated });
    render(<DashboardPage />);

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-user-profile")).toHaveTextContent(
      roleText,
    );
    expect(screen.getByTestId("dashboard-user-profile")).toHaveTextContent(
      String(isAuthenticated),
    );
  });
});
