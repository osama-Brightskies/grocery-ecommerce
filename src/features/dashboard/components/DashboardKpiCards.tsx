import {
  Users,
  Layers,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";

export type DashboardKpiCardsProps = {
  totalUsers: number;
  activeUsers: number;
  totalCategories: number;
  totalProducts: number;
  criticalProductsCount: number;
  totalCartActions: number;
  addToCartCount: number;
  removeFromCartCount: number;
  isLoading?: boolean;
};

export function DashboardKpiCards({
  totalUsers,
  activeUsers,
  totalCategories,
  totalProducts,
  criticalProductsCount,
  totalCartActions,
  addToCartCount,
  removeFromCartCount,
  isLoading = false,
}: DashboardKpiCardsProps) {
  const inactiveUsers = Math.max(0, totalUsers - activeUsers);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Users Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <Typography
            variant="muted"
            className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Total Users
          </Typography>
          <Typography
            variant="h1"
            className="text-3xl font-bold text-sidebar-bg font-mono"
          >
            {isLoading ? "—" : totalUsers}
          </Typography>
          <div className="text-[11px] text-text-secondary font-medium">
            <span className="text-brand-primary font-semibold">
              {activeUsers} active
            </span>
            <span className="mx-1">•</span>
            <span>{inactiveUsers} inactive</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-brand-primary flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Categories Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <Typography
            variant="muted"
            className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Categories
          </Typography>
          <Typography
            variant="h1"
            className="text-3xl font-bold text-sidebar-bg font-mono"
          >
            {isLoading ? "—" : totalCategories}
          </Typography>
          <Typography
            variant="muted"
            className="text-[11px] text-text-secondary"
          >
            Catalog categories
          </Typography>
        </div>
        {/* Unified Brand Green Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-brand-primary flex items-center justify-center shrink-0">
          <Layers className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Catalog Products & Inventory Health Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <Typography
            variant="muted"
            className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Catalog Products
          </Typography>
          <Typography
            variant="h1"
            className="text-3xl font-bold text-sidebar-bg font-mono"
          >
            {isLoading ? "—" : totalProducts}
          </Typography>
          <div className="text-[11px] font-medium flex items-center gap-1">
            {criticalProductsCount > 0 ? (
              <span className="text-status-danger-text font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {criticalProductsCount} low / out of stock
              </span>
            ) : (
              <span className="text-brand-primary font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Inventory healthy
              </span>
            )}
          </div>
        </div>
        {/* Unified Brand Green Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-brand-primary flex items-center justify-center shrink-0">
          <Package className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Cart Behavior & Actions Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <Typography
            variant="muted"
            className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Cart Actions
          </Typography>
          <Typography
            variant="h1"
            className="text-3xl font-bold text-sidebar-bg font-mono"
          >
            {isLoading ? "—" : totalCartActions}
          </Typography>
          <div className="text-[11px] text-text-secondary font-medium">
            <span className="text-brand-primary font-semibold">
              +{addToCartCount} added
            </span>
            <span className="mx-1">•</span>
            <span className="text-status-warning-text font-semibold">
              -{removeFromCartCount} removed
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-brand-primary flex items-center justify-center shrink-0">
          <ShoppingCart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default DashboardKpiCards;
