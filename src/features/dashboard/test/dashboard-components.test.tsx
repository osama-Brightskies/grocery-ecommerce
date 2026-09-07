import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardKpiCards } from "../components/DashboardKpiCards";
import { UserGrowthChart } from "../components/UserGrowthChart";
import { UserStatusDonutChart } from "../components/UserStatusDonutChart";
import { CartActivityBarChart } from "../components/CartActivityBarChart";

vi.mock("recharts", () => ({
  Area: () => null,
  AreaChart: ({ data, children }: { data: unknown; children: ReactNode }) => (
    <div data-testid="area-chart" data-chart={JSON.stringify(data)}>
      {children}
    </div>
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
  it("renders KPI values and computes the active-user percentage", () => {
    render(
      <DashboardKpiCards
        totalUsers={8}
        totalCategories={4}
        activeUsers={6}
        totalProducts={20}
        criticalProductsCount={2}
        totalCartActions={12}
        addToCartCount={9}
        removeFromCartCount={2}
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
        addToCartCount={9}
        removeFromCartCount={2}
        isLoading
      />,
    );
    expect(screen.queryByText("12")).not.toBeInTheDocument();
  });
});

describe("dashboard charts", () => {
  it("builds the user growth series with the current total", () => {
    render(
      <UserGrowthChart totalUsers={42} data={[{ month: "Aug", users: 42 }]} />,
    );
    expect(screen.getByText("User Registrations Trend")).toBeInTheDocument();
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
        addToFavoritesCount={4}
        removeFromCartCount={2}
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
});
