import {
  Users,
  Layers,
  Activity,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";

export type DashboardKpiCardsProps = {
  totalUsers: number;
  totalCategories: number;
  activeUsers: number;
  totalCartActions: number;
  isLoading?: boolean;
};

export function DashboardKpiCards({
  totalUsers,
  totalCategories,
  activeUsers,
  totalCartActions,
  isLoading = false,
}: DashboardKpiCardsProps) {
  const activePercentage = Math.round((activeUsers / (totalUsers || 1)) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Users */}
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
          <span className="text-[11px] text-brand-primary font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12% this month
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-brand-primary flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Categories */}
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
          <span className="text-[11px] text-text-secondary">
            Active in catalog
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-soft border border-border text-sidebar-bg flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Active Ratio */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <Typography
            variant="muted"
            className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Active Ratio
          </Typography>
          <Typography
            variant="h1"
            className="text-3xl font-bold text-sidebar-bg font-mono"
          >
            {isLoading ? "—" : `${activePercentage}%`}
          </Typography>
          <span className="text-[11px] text-brand-primary font-semibold">
            {activeUsers} accounts active
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-brand-primary flex items-center justify-center">
          <Activity className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Cart Actions */}
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
          <span className="text-[11px] text-text-secondary">
            Logged in timeline
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-soft border border-border text-sidebar-bg flex items-center justify-center">
          <ShoppingCart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default DashboardKpiCards;
