import { Clock, ShoppingCart, ShoppingBag, Eye } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { formatDateTime } from "@/lib/utils";
import type { UserActivity } from "../types/users.types";

export type UserActivityTimelineProps = {
  activities?: UserActivity[];
  isLoading?: boolean;
};

function formatActionType(action?: string): string {
  if (!action) return "Activity recorded";
  if (action === "AddToCart") return "Added to cart";
  if (action === "RemoveFromCart") return "Removed from cart";
  if (action === "ViewProduct" || action === "ViewedProduct")
    return "Viewed product";
  return action.replace(/([A-Z])/g, " $1").trim();
}

function formatProductSlug(slug?: string): string {
  if (!slug) return "—";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function UserActivityTimeline({
  activities = [],
  isLoading = false,
}: UserActivityTimelineProps) {
  // 🛡️ Filter out any corrupted activity items where slug is null or empty
  const validActivities = (Array.isArray(activities) ? activities : []).filter(
    (act) => Boolean(act && act.slug && act.slug.trim()),
  );

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <Clock className="w-5 h-5 text-sidebar-bg" />
        <Typography variant="h3" className="font-semibold text-sidebar-bg">
          Recent activity
        </Typography>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="py-8 text-center">
          <Typography variant="muted" className="text-sm text-text-secondary">
            Loading activity history...
          </Typography>
        </div>
      ) : validActivities.length === 0 ? (
        <div className="py-8 text-center">
          <Typography variant="muted" className="text-sm text-text-secondary">
            No recent activities recorded for this user.
          </Typography>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6">
          {/* Continuous Line */}
          <div className="absolute left-1.75 top-3 bottom-6 w-0.5 bg-border" />

          {validActivities.map((act, index) => {
            const isRemove = act.actionType === "RemoveFromCart";
            const isView =
              act.actionType === "ViewProduct" ||
              act.actionType === "ViewedProduct";

            return (
              <div
                key={`${act.slug}-${act.timestamp}-${index}`}
                className="relative flex items-center justify-between gap-4"
              >
                {/* Dot */}
                <div className="absolute -left-5.25 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-card" />
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 pl-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center shrink-0">
                    {isRemove ? (
                      <ShoppingBag className="w-5 h-5 text-text-secondary" />
                    ) : isView ? (
                      <Eye className="w-5 h-5 text-text-secondary" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Typography
                      variant="body"
                      className="font-semibold text-sidebar-bg text-sm"
                    >
                      {formatActionType(act.actionType)}
                    </Typography>
                    <Typography
                      variant="muted"
                      className="text-xs text-text-secondary font-medium"
                    >
                      {formatProductSlug(act.slug)}
                    </Typography>
                  </div>
                </div>

                {/* Timestamp */}
                <Typography
                  variant="muted"
                  className="text-xs text-text-secondary shrink-0"
                >
                  {formatDateTime(act.timestamp)}
                </Typography>
              </div>
            );
          })}

          <div className="pt-4 text-center border-t border-border/50">
            <Typography variant="muted" className="text-xs text-text-secondary">
              No more activities
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserActivityTimeline;
