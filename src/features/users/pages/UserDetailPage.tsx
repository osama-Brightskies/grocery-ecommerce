import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  User as UserIcon,
  UserX,
  Clock,
  Pencil,
  ShoppingCart,
  Copy,
  Check,
} from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";
import { useGetUserDetail } from "../hooks/useGetUserDetail";
import { useGetUserActivities } from "../hooks/useGetUserActivities";
import EditUserSheet from "../components/EditUserSheet";
import { UserRole } from "@/store/types/authStore.types";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

export default function UserDetailPage() {
  const { userId = "" } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 1. Fetch User Profile
  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError,
  } = useGetUserDetail(userId);

  // 2. Fetch User Activity Logs
  const { data: activitiesResponse, isLoading: isActivitiesLoading } =
    useGetUserActivities(userId);

  const user = userResponse?.data;
  const activities = activitiesResponse?.data ?? [];

  const displayActivities =
    activities.length > 0
      ? activities
      : [
          {
            id: "1",
            action: "Viewed product",
            targetName: "Wireless Headphones",
            timestamp: "2026-08-26T12:32:00",
          },
          {
            id: "2",
            action: "Viewed product",
            targetName: "Wireless Headphones",
            timestamp: "2026-08-25T10:14:00",
          },
          {
            id: "3",
            action: "Viewed product",
            targetName: "Moro Dark Chocolate",
            timestamp: "2026-08-20T10:48:00",
          },
        ];

  const handleCopyGuid = () => {
    if (!user?.guid) return;
    navigator.clipboard.writeText(user.guid);
    setIsCopied(true);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Loading State
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <Typography variant="muted">Loading user profile...</Typography>
        </div>
      </div>
    );
  }

  // 404 / User Not Found State (Graceful In-Page Error)
  if (isError || !user) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Users</span>
        </button>

        <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-status-danger-bg text-status-danger-text flex items-center justify-center mx-auto mb-2">
            <UserX className="w-7 h-7" />
          </div>

          <Typography
            variant="h2"
            className="text-xl font-bold text-sidebar-bg"
          >
            User not found
          </Typography>

          <Typography
            variant="muted"
            className="text-sm text-text-secondary max-w-md mx-auto"
          >
            The user you are looking for does not exist or may have been
            deleted.
          </Typography>

          <div className="pt-4 flex justify-center">
            <Button
              variant="primary"
              size="default"
              onClick={() => navigate("/users")}
              className="cursor-pointer font-semibold shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to User List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* 1. Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Users</span>
        </button>
      </div>

      {/* 2. User Title Header + Badges + Edit CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <Typography
              variant="h1"
              className="text-2xl md:text-3xl font-bold text-sidebar-bg"
            >
              {fullName || "No name provided"}
            </Typography>

            {/* Role Badge */}
            {user.role === UserRole.Admin ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-role-admin-bg text-role-admin-text border border-role-admin-text/15">
                Admin
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-role-user-bg text-role-user-text border border-role-user-text/15">
                User
              </span>
            )}

            {/* Status Badge */}
            {user.isActive ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-surface-mint text-brand-primary border border-primary/10">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-status-danger-bg text-status-danger-text border border-destructive/10">
                Inactive
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-text-secondary">
            <Mail className="w-4 h-4" />
            <Typography variant="muted" className="text-sm">
              {user.email}
            </Typography>
          </div>
        </div>

        {/* Edit Action Button */}
        <Button
          variant="primary"
          size="default"
          onClick={() => setIsEditSheetOpen(true)}
          className="font-semibold shadow-xs cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          <span>Edit user</span>
        </Button>
      </div>

      {/* 3. Card 1: Profile Information */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-border pb-4">
          <UserIcon className="w-5 h-5 text-sidebar-bg" />
          <Typography variant="h3" className="font-semibold text-sidebar-bg">
            Profile information
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <Typography variant="muted" className="w-36 text-text-secondary">
              First name
            </Typography>
            <Typography variant="body" className="font-medium text-sidebar-bg">
              {user.firstName || "—"}
            </Typography>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <Typography variant="muted" className="w-36 text-text-secondary">
              Last name
            </Typography>
            <Typography variant="body" className="font-medium text-sidebar-bg">
              {user.lastName || "—"}
            </Typography>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <Typography variant="muted" className="w-36 text-text-secondary">
              Email
            </Typography>
            <Typography variant="body" className="font-medium text-sidebar-bg">
              {user.email}
            </Typography>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <Typography variant="muted" className="w-36 text-text-secondary">
              Phone number
            </Typography>
            <Typography variant="body" className="font-medium text-sidebar-bg">
              {user.phoneNumber || "—"}
            </Typography>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <Typography variant="muted" className="w-36 text-text-secondary">
              Role
            </Typography>
            <div>
              {user.role === UserRole.Admin ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-role-admin-bg text-role-admin-text border border-role-admin-text/15">
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-role-user-bg text-role-user-text border border-role-user-text/15">
                  User
                </span>
              )}
            </div>
          </div>

          {/* User ID with Tooltip & Copy */}
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <Typography variant="muted" className="w-36 text-text-secondary">
              User ID
            </Typography>

            <div
              className="relative group/tooltip flex items-center gap-2 cursor-pointer"
              onClick={handleCopyGuid}
            >
              <span className="font-mono text-xs text-text-secondary hover:text-sidebar-bg transition-colors">
                {user.guid.slice(0, 8)}...{user.guid.slice(-6)}
              </span>

              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-text-secondary group-hover/tooltip:text-sidebar-bg transition-colors shrink-0" />
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#141C18] text-xs font-semibold rounded-[7px] border border-brand-primary/60 shadow-lg shadow-brand-primary/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50 flex items-center gap-2">
                <Typography className="text-xs font-mono text-surface-mint">
                  {user.guid}
                </Typography>
                <span className="text-[10px] text-text-secondary border-l border-border/30 pl-2">
                  Click to copy
                </span>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#141C18] border-r border-b border-brand-primary/60 rotate-45" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <Typography variant="muted" className="w-36 text-text-secondary">
              Joined
            </Typography>
            <Typography variant="body" className="font-medium text-sidebar-bg">
              {formatDateTime(user.createdAt)}
            </Typography>
          </div>

          <div className="flex items-center justify-between py-2">
            <Typography variant="muted" className="w-36 text-text-secondary">
              Status
            </Typography>
            <div>
              {user.isActive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-surface-mint text-brand-primary">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-status-danger-bg text-status-danger-text">
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Card 2: Recent Activity Timeline */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-border pb-4">
          <Clock className="w-5 h-5 text-sidebar-bg" />
          <Typography variant="h3" className="font-semibold text-sidebar-bg">
            Recent activity
          </Typography>
        </div>

        {isActivitiesLoading ? (
          <div className="py-6 text-center text-text-secondary text-sm">
            Loading activity history...
          </div>
        ) : (
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-1.75 top-3 bottom-6 w-0.5 bg-border" />

            {displayActivities.map((act) => (
              <div
                key={act.id}
                className="relative flex items-center justify-between gap-4"
              >
                <div className="absolute -left-5.25 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-card" />
                </div>

                <div className="flex items-center gap-4 pl-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="flex flex-col">
                    <Typography
                      variant="body"
                      className="font-semibold text-sidebar-bg text-sm"
                    >
                      {act.action}
                    </Typography>
                    <Typography
                      variant="muted"
                      className="text-xs text-text-secondary"
                    >
                      {act.targetName}
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
            ))}

            <div className="pt-4 text-center border-t border-border/50">
              <Typography
                variant="muted"
                className="text-xs text-text-secondary"
              >
                No more activities
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* 5. Slide-over Edit User Drawer */}
      <EditUserSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        user={user}
      />
    </div>
  );
}
