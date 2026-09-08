import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@/components/ui/shared/Typography";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import { useGetCategories } from "@/features/categories/hooks/useGetCategories";
import { useGetUserActivities } from "@/features/users/hooks/useGetUserActivities";
import { getProductsApi } from "@/features/products/api/getProducts";
import { calculateUserGrowth } from "@/lib/utils";
import { DashboardKpiCards } from "./components/DashboardKpiCards";
import { UserGrowthChart } from "./components/UserGrowthChart";
import { UserStatusDonutChart } from "./components/UserStatusDonutChart";
import { CartActivityBarChart } from "./components/CartActivityBarChart";
import { LowStockWatchCard } from "./components/LowStockWatchCard";
import type { PaginatedProductsResponse } from "@/features/products/products.types";

export default function DashboardPage() {
  // 1. Fetch Users Query
  const { data: usersResponse, isLoading: isUsersLoading } = useGetUsers(
    { pageNumber: 1, pageSize: 50 },
    { enabled: true },
  );

  // 2. Fetch Categories Query
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategories({ limit: 50 });

  // 3. Fetch Activities Query
  const { data: activitiesResponse, isLoading: isActivitiesLoading } =
    useGetUserActivities();

  // 4. Fetch Products Catalog (100 items with 30s cache)
  const { data: productsResponse, isLoading: isProductsLoading } =
    useQuery<PaginatedProductsResponse>({
      queryKey: ["dashboard-catalog-products"],
      queryFn: () => getProductsApi(100) as Promise<PaginatedProductsResponse>,
      staleTime: 30 * 1000,
    });

  // User Stats
  const { totalUsersCount, activeUsersCount, inactiveUsersCount, growthData } =
    useMemo(() => {
      const userList = usersResponse?.data?.data ?? [];
      const total =
        usersResponse?.data?.pagination?.totalCount ?? userList.length;
      const active = userList.filter((u) => u.isActive).length;
      const growth = calculateUserGrowth(userList);

      return {
        totalUsersCount: total,
        activeUsersCount: active,
        inactiveUsersCount: Math.max(0, total - active),
        growthData: growth,
      };
    }, [usersResponse]);

  const totalCategoriesCount = categoriesResponse?.data?.data?.length ?? 0;

  // Products
  const products = useMemo(() => {
    return productsResponse?.data?.data ?? [];
  }, [productsResponse]);

  const { totalProductsCount, criticalProductsCount } = useMemo(() => {
    return {
      totalProductsCount: products.length,
      criticalProductsCount: products.filter(
        (p) => Number(p.stockQuantity ?? 0) <= 10,
      ).length,
    };
  }, [products]);

  // Activity Calculations (Orders, Add to Cart, Remove from Cart Only)
  const { ordersPlacedCount, addToCartCount, removeFromCartCount } =
    useMemo(() => {
      const activityList = activitiesResponse?.data?.data ?? [];

      let orders = 0;
      let addCart = 0;
      let removeCart = 0;

      for (const item of activityList) {
        const act = String(item.actionType || "")
          .toLowerCase()
          .replace(/[^a-z]/g, "");

        // 1. Orders
        if (act.includes("order")) {
          orders++;
        }
        // 2. Cart Actions
        else if (act.includes("cart")) {
          if (act.includes("remov")) {
            removeCart++;
          } else {
            addCart++;
          }
        }
      }

      return {
        ordersPlacedCount: orders,
        addToCartCount: addCart,
        removeFromCartCount: removeCart,
      };
    }, [activitiesResponse]);

  const totalCartActions =
    ordersPlacedCount + addToCartCount + removeFromCartCount;

  const isLoadingAny =
    isUsersLoading ||
    isCategoriesLoading ||
    isActivitiesLoading ||
    isProductsLoading;

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* Page Header */}
      <div className="space-y-1">
        <Typography
          variant="h1"
          className="text-2xl md:text-3xl font-bold text-sidebar-bg"
        >
          Admin Dashboard
        </Typography>
        <Typography variant="muted" className="text-sm text-text-secondary">
          Live catalog overview, user statistics, and warehouse inventory
          monitoring
        </Typography>
      </div>

      {/* 1. KPI Metric Summary Cards */}
      <DashboardKpiCards
        totalUsers={totalUsersCount}
        activeUsers={activeUsersCount}
        totalCategories={totalCategoriesCount}
        totalProducts={totalProductsCount}
        criticalProductsCount={criticalProductsCount}
        totalCartActions={totalCartActions}
        addToCartCount={addToCartCount}
        removeFromCartCount={removeFromCartCount}
        isLoading={isLoadingAny}
      />

      {/* 2. User Growth & Status Donut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserGrowthChart totalUsers={totalUsersCount} data={growthData} />
        <UserStatusDonutChart
          totalUsers={totalUsersCount}
          activeUsers={activeUsersCount}
          inactiveUsers={inactiveUsersCount}
        />
      </div>

      {/* 3. Customer Store Engagement Bar Chart */}
      <CartActivityBarChart
        ordersPlacedCount={ordersPlacedCount}
        addToCartCount={addToCartCount}
        removeFromCartCount={removeFromCartCount}
      />

      {/* 4. Complete Catalog Low Stock Watchlist */}
      <LowStockWatchCard products={products} isLoading={isProductsLoading} />
    </div>
  );
}
