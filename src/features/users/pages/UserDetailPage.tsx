import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";
import { useGetUserDetail } from "../hooks/useGetUserDetail";
import { useGetUserActivities } from "../hooks/useGetUserActivities";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { UserActivityTimeline } from "../components/UserActivityTimeline";
import { UserOrderHistoryCard } from "../components/UserOrderHistoryCard";
import { UserNotFoundState } from "../components/UserNotFoundState";
import EditUserSheet from "../components/EditUserSheet";
import { cn } from "@/lib/utils";

export default function UserDetailPage() {
  const { userId = "" } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // 1. Fetch User Profile
  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError,
  } = useGetUserDetail(userId);

  // 2. Fetch User Activities
  const { data: activitiesResponse, isLoading: isActivitiesLoading } =
    useGetUserActivities(userId);

  const user = userResponse?.data;
  const activities = activitiesResponse?.data?.data ?? [];

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

  // 404 State
  if (isError || !user) {
    return <UserNotFoundState />;
  }

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    "No name provided";

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Back Link */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <Typography variant="body" className="font-medium text-inherit">
            Users
          </Typography>
        </button>
      </div>

      {/* Page Title & Status Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <Typography
            variant="h1"
            className="text-2xl md:text-3xl font-bold text-sidebar-bg"
          >
            {fullName}
          </Typography>

          <Badge
            variant="outline"
            className={cn(
              "px-2.5 py-0.5 text-xs font-semibold border inline-flex items-center gap-1.5 select-none",
              user.isActive
                ? "bg-surface-mint text-brand-primary border-brand-primary/20"
                : "bg-status-danger-bg text-status-danger-text border-status-danger-text/20",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                user.isActive ? "bg-brand-primary" : "bg-status-danger-text",
              )}
            />
            <span>{user.isActive ? "Active" : "Inactive"}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-text-secondary">
          <Mail className="w-4 h-4" />
          <Typography variant="muted" className="text-sm">
            {user.email}
          </Typography>
        </div>
      </div>

      {/* 1. Top Section: Profile Information Card (With Edit User Button) */}
      <UserProfileInfo user={user} onEdit={() => setIsEditSheetOpen(true)} />

      {/* 2. Bottom Section: 2-Column Split (Activity on Left, Orders on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Recent Activity Timeline */}
        <UserActivityTimeline
          activities={activities}
          isLoading={isActivitiesLoading}
        />

        {/* Right Column: Order History Card with Collapsible */}
        <UserOrderHistoryCard userGuid={user.guid} />
      </div>

      {/* Edit Drawer */}
      <EditUserSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        user={user}
      />
    </div>
  );
}
