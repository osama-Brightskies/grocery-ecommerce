import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "../DashboardPage";

const { usersHook, categoriesHook, activitiesHook } = vi.hoisted(() => ({
  usersHook: vi.fn(),
  categoriesHook: vi.fn(),
  activitiesHook: vi.fn(),
}));

vi.mock("@/features/users/hooks/useGetUsers", () => ({
  useGetUsers: usersHook,
}));
vi.mock("@/features/categories/hooks/useGetCategories", () => ({
  useGetCategories: categoriesHook,
}));
vi.mock("@/features/users/hooks/useGetUserActivities", () => ({
  useGetUserActivities: activitiesHook,
}));
vi.mock("../components/DashboardKpiCards", () => ({
  DashboardKpiCards: (props: object) => (
    <div data-testid="kpis">{JSON.stringify(props)}</div>
  ),
}));
vi.mock("../components/UserGrowthChart", () => ({
  UserGrowthChart: (props: object) => (
    <div data-testid="growth">{JSON.stringify(props)}</div>
  ),
}));
vi.mock("../components/UserStatusDonutChart", () => ({
  UserStatusDonutChart: (props: object) => (
    <div data-testid="status">{JSON.stringify(props)}</div>
  ),
}));
vi.mock("../components/CartActivityBarChart", () => ({
  CartActivityBarChart: (props: object) => (
    <div data-testid="cart">{JSON.stringify(props)}</div>
  ),
}));

describe("DashboardPage", () => {
  it("maps endpoint data to the dashboard metrics and charts", () => {
    usersHook.mockReturnValue({
      data: {
        data: {
          data: [{ isActive: true }, { isActive: false }, { isActive: true }],
          pagination: { totalCount: 5 },
        },
      },
      isLoading: false,
    });
    categoriesHook.mockReturnValue({
      data: { data: { data: [{ id: "fruit" }, { id: "vegetables" }] } },
      isLoading: false,
    });
    activitiesHook.mockReturnValue({
      data: {
        data: {
          data: [
            { actionType: "AddToCart" },
            { actionType: "AddToCart" },
            { actionType: "RemoveFromCart" },
            { actionType: "Login" },
          ],
        },
      },
      isLoading: false,
    });

    render(<DashboardPage />);

    expect(
      screen.getByRole("heading", { name: "Admin Dashboard" }),
    ).toBeInTheDocument();
    expect(usersHook).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 50 });
    expect(categoriesHook).toHaveBeenCalledWith({ limit: 50 });
    expect(activitiesHook).toHaveBeenCalledWith();
    expect(screen.getByTestId("kpis")).toHaveTextContent(
      JSON.stringify({
        totalUsers: 5,
        totalCategories: 2,
        activeUsers: 2,
        totalCartActions: 3,
        isLoading: false,
      }),
    );
    expect(screen.getByTestId("growth")).toHaveTextContent(
      JSON.stringify({ totalUsers: 5 }),
    );
    expect(screen.getByTestId("status")).toHaveTextContent(
      JSON.stringify({
        totalUsers: 5,
        activeUsers: 2,
        inactiveUsers: 3,
      }),
    );
    expect(screen.getByTestId("cart")).toHaveTextContent(
      JSON.stringify({
        addToCartCount: 2,
        removeFromCartCount: 1,
      }),
    );
  });
});
