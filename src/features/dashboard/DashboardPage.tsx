import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@/components/ui/shared/Typography";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import { useGetCategories } from "@/features/categories/hooks/useGetCategories";
import { getProductsApi } from "@/features/products/api/getProducts";
import { calculateLast3MonthsGrowth } from "@/lib/utils";
import { DashboardKpiCards } from "./components/DashboardKpiCards";
import { UserGrowthChart } from "./components/UserGrowthChart";
import { UserStatusDonutChart } from "./components/UserStatusDonutChart";
import { CartActivityBarChart } from "./components/CartActivityBarChart";
import { LowStockWatchCard } from "./components/LowStockWatchCard";
import { useGetAllUserActivities } from "../users/hooks/useGetAllUsersActivities";
import type { PaginatedProductsResponse } from "../products/types/products.types";

// 🪄 Self-contained Action Classifier
type ActionCategory =
  | "place_order"
  | "add_to_cart"
  | "remove_from_cart"
  | "add_to_favorites"
  | "remove_from_favorites"
  | "other";

function classifyAction(raw?: string): ActionCategory {
  if (!raw) return "other";
  const s = raw.toLowerCase().replace(/[^a-z]/g, "");

  if (s.includes("order")) return "place_order";

  if (s.includes("cart")) {
    return s.includes("remov") ? "remove_from_cart" : "add_to_cart";
  }

  if (s.includes("fav") || s.includes("wish")) {
    return s.includes("remov") ? "remove_from_favorites" : "add_to_favorites";
  }

  return "other";
}

export default function DashboardPage() {
  // 1. Fetch Users Query (600 covers entire database)
  const { data: usersResponse, isLoading: isUsersLoading } = useGetUsers({
    pageNumber: 1,
    pageSize: 600,
  });

  // 2. Fetch Categories Query
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategories({ limit: 50 });

  // 3. Fetch All Store Activities (100 latest)
  const { data: activitiesResponse, isLoading: isActivitiesLoading } =
    useGetAllUserActivities(100);

  // 4. Fetch Products Catalog (100 items)
  const { data: productsResponse, isLoading: isProductsLoading } =
    useQuery<PaginatedProductsResponse>({
      queryKey: ["products", "dashboard-catalog"],
      queryFn: () => getProductsApi(100) as Promise<PaginatedProductsResponse>,
      staleTime: 30 * 1000,
    });

  // User Calculations
  const { totalUsersCount, activeUsersCount, inactiveUsersCount, growthData } =
    useMemo(() => {
      const userList = usersResponse?.data?.data ?? [];
      const total =
        usersResponse?.data?.pagination?.totalCount ?? userList.length;
      const active = userList.filter((u) => u.isActive).length;
      const growth = calculateLast3MonthsGrowth(userList, total);

      return {
        totalUsersCount: total,
        activeUsersCount: active,
        inactiveUsersCount: Math.max(0, total - active),
        growthData: growth,
      };
    }, [usersResponse]);

  const totalCategoriesCount = categoriesResponse?.data?.data?.length ?? 0;

  // Products Calculations
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

  // Robust Classification of all 100 actions
  const {
    ordersPlacedCount,
    addToCartCount,
    removeFromCartCount,
    addToFavoritesCount,
    removeFromFavoritesCount,
  } = useMemo(() => {
    const activityList = activitiesResponse?.data?.data ?? [];

    let orders = 0;
    let addCart = 0;
    let removeCart = 0;
    let addFav = 0;
    let removeFav = 0;

    for (const item of activityList) {
      const category = classifyAction(item.actionType);

      if (category === "place_order") orders++;
      else if (category === "add_to_cart") addCart++;
      else if (category === "remove_from_cart") removeCart++;
      else if (category === "add_to_favorites") addFav++;
      else if (category === "remove_from_favorites") removeFav++;
    }

    return {
      ordersPlacedCount: orders,
      addToCartCount: addCart,
      removeFromCartCount: removeCart,
      addToFavoritesCount: addFav,
      removeFromFavoritesCount: removeFav,
    };
  }, [activitiesResponse]);

  const totalCartActions =
    ordersPlacedCount +
    addToCartCount +
    removeFromCartCount +
    addToFavoritesCount +
    removeFromFavoritesCount;

  const isLoadingAny =
    isUsersLoading ||
    isCategoriesLoading ||
    isActivitiesLoading ||
    isProductsLoading;

  return (
    <div className="space-y-8 w-full pb-16">
      {/* Header */}
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

      {/* 1. Real-Data KPI Cards */}
      <DashboardKpiCards
        totalUsers={totalUsersCount}
        activeUsers={activeUsersCount}
        totalCategories={totalCategoriesCount}
        totalProducts={totalProductsCount}
        criticalProductsCount={criticalProductsCount}
        totalCartActions={totalCartActions}
        positiveActionsCount={addToCartCount + addToFavoritesCount}
        negativeActionsCount={removeFromCartCount + removeFromFavoritesCount}
        isLoading={isLoadingAny}
      />

      {/* 2. User Growth & Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserGrowthChart data={growthData} totalUsers={totalUsersCount} />
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
        addToFavoritesCount={addToFavoritesCount}
        removeFromFavoritesCount={removeFromFavoritesCount}
      />

      {/* 4. Complete Catalog Low Stock Watchlist */}
      <LowStockWatchCard products={products} isLoading={isProductsLoading} />
    </div>
  );
}
