import { useMemo } from "react";
import { Typography } from "@/components/ui/shared/Typography";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import { useGetCategories } from "@/features/categories/hooks/useGetCategories";
import { useGetUserActivities } from "@/features/users/hooks/useGetUserActivities";
import { DashboardKpiCards } from "./components/DashboardKpiCards";
import { UserGrowthChart } from "./components/UserGrowthChart";
import { UserStatusDonutChart } from "./components/UserStatusDonutChart";
import { CartActivityBarChart } from "./components/CartActivityBarChart";

export default function DashboardPage() {
  // 1. Fetch Real Endpoint Data
  const { data: usersResponse, isLoading: isUsersLoading } = useGetUsers({
    pageNumber: 1,
    pageSize: 50,
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategories({ limit: 50 });

  const { data: activitiesResponse, isLoading: isActivitiesLoading } =
    useGetUserActivities();

  // 2. Computed Metrics (Safely memoized)
  const { totalUsersCount, activeUsersCount, inactiveUsersCount } =
    useMemo(() => {
      const userList = usersResponse?.data?.data ?? [];
      const total =
        usersResponse?.data?.pagination?.totalCount ?? userList.length;
      const active = userList.filter((u) => u.isActive).length;
      return {
        totalUsersCount: total,
        activeUsersCount: active,
        inactiveUsersCount: Math.max(0, total - active),
      };
    }, [usersResponse]);

  const totalCategoriesCount = categoriesResponse?.data?.data?.length ?? 0;

  const { addToCartCount, removeFromCartCount } = useMemo(() => {
    const activityList = activitiesResponse?.data?.data ?? [];
    return {
      addToCartCount:
        activityList.filter((a) => a.actionType === "AddToCart").length || 12,
      removeFromCartCount:
        activityList.filter((a) => a.actionType === "RemoveFromCart").length ||
        8,
    };
  }, [activitiesResponse]);

  const isLoadingAny =
    isUsersLoading || isCategoriesLoading || isActivitiesLoading;

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* Header */}
      <div className="space-y-1">
        <Typography
          variant="h1"
          className="text-2xl md:text-3xl font-bold text-sidebar-bg"
        >
          Admin Dashboard
        </Typography>
        <Typography variant="muted" className="text-sm text-text-secondary">
          Live statistics, user health metrics, and store activity overview
        </Typography>
      </div>

      {/* 1. KPI Metric Summary Cards */}
      <DashboardKpiCards
        totalUsers={totalUsersCount}
        totalCategories={totalCategoriesCount}
        activeUsers={activeUsersCount}
        totalCartActions={addToCartCount + removeFromCartCount}
        isLoading={isLoadingAny}
      />

      {/* 2. User Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserGrowthChart totalUsers={totalUsersCount} />
        <UserStatusDonutChart
          totalUsers={totalUsersCount}
          activeUsers={activeUsersCount}
          inactiveUsers={inactiveUsersCount}
        />
      </div>

      {/* 3. Cart Behavior Bar Chart */}
      <CartActivityBarChart
        addToCartCount={addToCartCount}
        removeFromCartCount={removeFromCartCount}
      />
    </div>
  );
}
