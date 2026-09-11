import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "../DashboardPage";

const { usersHook, categoriesHook, activitiesHook, productsQuery } = vi.hoisted(
  () => ({
    usersHook: vi.fn(),
    categoriesHook: vi.fn(),
    activitiesHook: vi.fn(),
    productsQuery: vi.fn(),
  }),
);

vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-query")>()),
  useQuery: productsQuery,
}));

vi.mock("@/features/users/hooks/useGetUsers", () => ({
  useGetUsers: usersHook,
}));
vi.mock("@/features/categories/hooks/useGetCategories", () => ({
  useGetCategories: categoriesHook,
}));
vi.mock("@/features/users/hooks/useGetAllUsersActivities", () => ({
  useGetAllUserActivities: activitiesHook,
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
vi.mock("../components/LowStockWatchCard", () => ({
  LowStockWatchCard: (props: object) => (
    <div data-testid="low-stock">{JSON.stringify(props)}</div>
  ),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    productsQuery.mockReturnValue({
      data: { data: { data: [] } },
      isLoading: false,
    });
  });

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
    expect(usersHook).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 600 });
    expect(categoriesHook).toHaveBeenCalledWith({ limit: 50 });
    expect(activitiesHook).toHaveBeenCalledWith(100);
    expect(productsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["products", "dashboard-catalog"],
        staleTime: 30 * 1000,
      }),
    );
    expect(screen.getByTestId("kpis")).toHaveTextContent(
      JSON.stringify({
        totalUsers: 5,
        activeUsers: 2,
        totalCategories: 2,
        totalProducts: 0,
        criticalProductsCount: 0,
        totalCartActions: 3,
        positiveActionsCount: 2,
        negativeActionsCount: 1,
        isLoading: false,
      }),
    );
    expect(screen.getByTestId("growth")).toHaveTextContent(/"totalUsers":5/);
    expect(screen.getByTestId("growth")).toHaveTextContent(/"data":\[/);
    expect(screen.getByTestId("status")).toHaveTextContent(
      JSON.stringify({
        totalUsers: 5,
        activeUsers: 2,
        inactiveUsers: 3,
      }),
    );
    expect(screen.getByTestId("cart")).toHaveTextContent(
      JSON.stringify({
        ordersPlacedCount: 0,
        addToCartCount: 2,
        removeFromCartCount: 1,
        addToFavoritesCount: 0,
        removeFromFavoritesCount: 0,
      }),
    );
  });

  it("combines loading states and safely handles missing endpoint data", () => {
    usersHook.mockReturnValue({ data: undefined, isLoading: true });
    categoriesHook.mockReturnValue({ data: undefined, isLoading: false });
    activitiesHook.mockReturnValue({ data: undefined, isLoading: false });

    render(<DashboardPage />);

    expect(screen.getByTestId("kpis")).toHaveTextContent(
      JSON.stringify({
        totalUsers: 0,
        activeUsers: 0,
        totalCategories: 0,
        totalProducts: 0,
        criticalProductsCount: 0,
        totalCartActions: 0,
        positiveActionsCount: 0,
        negativeActionsCount: 0,
        isLoading: true,
      }),
    );
    expect(screen.getByTestId("status")).toHaveTextContent(
      JSON.stringify({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0 }),
    );
  });

  it("uses the returned user count when pagination metadata is absent", () => {
    usersHook.mockReturnValue({
      data: { data: { data: [{ isActive: true }, { isActive: false }] } },
      isLoading: false,
    });
    categoriesHook.mockReturnValue({
      data: { data: { data: [] } },
      isLoading: false,
    });
    activitiesHook.mockReturnValue({
      data: { data: { data: [{ actionType: "AddToCart" }] } },
      isLoading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("status")).toHaveTextContent(
      JSON.stringify({ totalUsers: 2, activeUsers: 1, inactiveUsers: 1 }),
    );
    expect(screen.getByTestId("cart")).toHaveTextContent(
      JSON.stringify({
        ordersPlacedCount: 0,
        addToCartCount: 1,
        removeFromCartCount: 0,
        addToFavoritesCount: 0,
        removeFromFavoritesCount: 0,
      }),
    );
  });
});
