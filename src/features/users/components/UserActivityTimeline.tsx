import {
  Clock,
  ShoppingCart,
  Trash2,
  Heart,
  HeartOff,
  PackageCheck,
  Eye,
} from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { formatDateTime } from "@/lib/utils";
import type { UserActivity } from "../types/users.types";

export type UserActivityTimelineProps = {
  activities?: UserActivity[];
  isLoading?: boolean;
};

function normalizeAction(action?: string): string {
  if (!action) return "";
  return action.toLowerCase().replace(/[^a-z]/g, "");
}

function formatActionType(action?: string): string {
  const norm = normalizeAction(action);
  if (norm.includes("placeorder") || norm.includes("orderplaced"))
    return "Placed order";
  if (norm.includes("fav") && !norm.includes("remov"))
    return "Added to favorites";
  if (norm.includes("fav") && norm.includes("remov"))
    return "Removed from favorites";
  if (norm.includes("cart") && norm.includes("remov"))
    return "Removed from cart";
  if (norm.includes("cart") && norm.includes("add")) return "Added to cart";
  if (norm.includes("view")) return "Viewed product";

  return action
    ? action.replace(/([A-Z])/g, " $1").trim()
    : "Activity recorded";
}

function getActivityIcon(action?: string) {
  const norm = normalizeAction(action);

  if (norm.includes("placeorder") || norm.includes("orderplaced")) {
    return <PackageCheck className="w-5 h-5 text-brand-primary" />;
  }
  // 🪄 Matches both favorite and favourite
  if (norm.includes("fav") && !norm.includes("remov")) {
    return <Heart className="w-5 h-5 text-avatar-pink fill-avatar-pink" />;
  }
  if (norm.includes("fav") && norm.includes("remov")) {
    return <HeartOff className="w-5 h-5 text-text-secondary" />;
  }
  if (norm.includes("cart") && norm.includes("remov")) {
    return <Trash2 className="w-5 h-5 text-status-danger-text" />;
  }
  if (norm.includes("view")) {
    return <Eye className="w-5 h-5 text-text-secondary" />;
  }

  return <ShoppingCart className="w-5 h-5 text-brand-primary" />;
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
  const validActivities = (Array.isArray(activities) ? activities : []).filter(
    (act) => Boolean(act && act.slug && act.slug.trim()),
  );

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <Clock className="w-5 h-5 text-sidebar-bg" />
        <Typography variant="h3" className="font-semibold text-sidebar-bg">
          Recent activity
        </Typography>
      </div>

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
          <div className="absolute left-1.75 top-3 bottom-6 w-0.5 bg-border" />

          {validActivities.map((act, index) => {
            const norm = normalizeAction(act.actionType);
            const isOrder = norm.includes("placeorder");

            return (
              <div
                key={`${act.slug}-${act.timestamp}-${index}`}
                className="relative flex items-center justify-between gap-4"
              >
                <div className="absolute -left-5.25 flex items-center justify-center">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ring-4 ring-card ${
                      isOrder ? "bg-brand-accent scale-110" : "bg-brand-primary"
                    }`}
                  />
                </div>

                <div className="flex items-center gap-4 pl-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center shrink-0">
                    {getActivityIcon(act.actionType)}
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
