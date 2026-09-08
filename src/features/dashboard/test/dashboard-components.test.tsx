import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DashboardKpiCards } from "../components/DashboardKpiCards";
import { UserGrowthChart } from "../components/UserGrowthChart";
import { UserStatusDonutChart } from "../components/UserStatusDonutChart";
import { CartActivityBarChart } from "../components/CartActivityBarChart";
import { LowStockWatchCard } from "../components/LowStockWatchCard";
import type { Product } from "@/features/products/products.types";

vi.mock("recharts", () => ({
  Area: () => null,
  AreaChart: ({ data, children }: { data: unknown; children: ReactNode }) => (
    <svg data-testid="area-chart" data-chart={JSON.stringify(data)}>
      {children}
    </svg>
  ),
  Bar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  BarChart: ({ data, children }: { data: unknown; children: ReactNode }) => (
    <div data-testid="bar-chart" data-chart={JSON.stringify(data)}>
      {children}
    </div>
  ),
  CartesianGrid: () => null,
  Cell: () => null,
  Pie: ({ data, children }: { data: unknown; children: ReactNode }) => (
    <div data-testid="pie" data-chart={JSON.stringify(data)}>
      {children}
    </div>
  ),
  PieChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  XAxis: () => null,
  YAxis: () => null,
}));

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

describe("DashboardKpiCards", () => {
  it("renders KPI values and inventory health", () => {
    render(
      <DashboardKpiCards
        totalUsers={8}
        totalCategories={4}
        activeUsers={6}
        totalProducts={20}
        criticalProductsCount={2}
        totalCartActions={12}
        positiveActionsCount={9}
        negativeActionsCount={2}
      />,
    );
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("6 active")).toBeInTheDocument();
    expect(screen.getByText("2 low / out of stock")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("hides metric values while loading", () => {
    render(
      <DashboardKpiCards
        totalUsers={8}
        totalCategories={4}
        activeUsers={6}
        totalProducts={20}
        criticalProductsCount={2}
        totalCartActions={12}
        positiveActionsCount={9}
        negativeActionsCount={2}
        isLoading
      />,
    );
    expect(screen.queryByText("12")).not.toBeInTheDocument();
  });
});

describe("dashboard charts", () => {
  it("builds the user growth series with the current total", () => {
    render(
      <UserGrowthChart
        totalUsers={42}
        data={[{ month: "Aug", users: 42, newUsers: 5 }]}
      />,
    );
    expect(screen.getByText("User Growth (Past 3 Months)")).toBeInTheDocument();
    expect(screen.getByText("Total Users: 42")).toBeInTheDocument();
    expect(screen.getByTestId("area-chart")).toHaveAttribute(
      "data-chart",
      expect.stringContaining('"month":"Aug","users":42'),
    );
  });

  it("renders active and inactive account totals", () => {
    render(
      <UserStatusDonutChart
        totalUsers={10}
        activeUsers={7}
        inactiveUsers={3}
      />,
    );
    expect(screen.getByText("Account Status Split")).toBeInTheDocument();
    expect(screen.getByText("Active (7)")).toBeInTheDocument();
    expect(screen.getByText("Inactive (3)")).toBeInTheDocument();
    expect(screen.getByTestId("pie")).toHaveAttribute(
      "data-chart",
      expect.stringContaining('"value":7'),
    );
  });

  it("builds cart activity bars from the supplied counts", () => {
    render(
      <CartActivityBarChart
        ordersPlacedCount={3}
        addToCartCount={9}
        removeFromCartCount={2}
        addToFavoritesCount={4}
        removeFromFavoritesCount={1}
      />,
    );
    expect(screen.getByText("Customer Store Engagement")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toHaveAttribute(
      "data-chart",
      expect.stringContaining('"count":9'),
    );
    expect(screen.getByTestId("bar-chart")).toHaveAttribute(
      "data-chart",
      expect.stringContaining('"count":2'),
    );
  });

  it("renders the empty states for charts without data", () => {
    render(
      <>
        <UserGrowthChart totalUsers={0} data={[]} />
        <UserStatusDonutChart
          totalUsers={0}
          activeUsers={0}
          inactiveUsers={0}
        />
        <CartActivityBarChart
          ordersPlacedCount={0}
          addToCartCount={0}
          removeFromCartCount={0}
          addToFavoritesCount={0}
          removeFromFavoritesCount={0}
        />
      </>,
    );
    expect(
      screen.getByText("No registration history available."),
    ).toBeInTheDocument();
    expect(screen.getByText("No user accounts found.")).toBeInTheDocument();
    expect(
      screen.getByText("No customer activity recorded in the timeline yet."),
    ).toBeInTheDocument();
  });
});

const product = (slug: string, stockQuantity: number): Product => ({
  name: slug === "sold-out" ? "Sold Out" : "Low Stock",
  slug,
  description: "Test product",
  price: 5,
  stockQuantity,
  isFavorited: false,
  creationDate: "2026-09-01T00:00:00Z",
  categorySlug: "fruit",
  tags: [],
});

describe("LowStockWatchCard", () => {
  it("renders loading and healthy inventory states", () => {
    const { rerender } = render(
      <MemoryRouter>
        <LowStockWatchCard products={[]} isLoading />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("Checking inventory levels..."),
    ).toBeInTheDocument();
    rerender(
      <MemoryRouter>
        <LowStockWatchCard products={[product("healthy", 11)]} />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("All inventory levels are healthy"),
    ).toBeInTheDocument();
  });

  it("shows critical products and navigates to product details", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <LowStockWatchCard
                products={[product("low", 7), product("sold-out", 0)]}
              />
            }
          />
          <Route
            path="/products/:slug"
            element={<div>Product destination</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("2 Items Critical")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock (0)")).toBeInTheDocument();
    expect(screen.getByText("7 units left")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Sold Out"));
    expect(screen.getByText("Product destination")).toBeInTheDocument();
  });
});
