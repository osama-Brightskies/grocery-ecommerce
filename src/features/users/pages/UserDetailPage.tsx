import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Pencil } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetUserDetail } from "../hooks/useGetUserDetail";
import { useGetUserActivities } from "../hooks/useGetUserActivities";
import { UserRole } from "@/store/types/authStore.types";
import UserProfileInfo from "../components/UserProfileInfo";
import UserActivityTimeline from "../components/UserActivityTimeline";
import UserNotFoundState from "../components/UserNotFoundState";
import EditUserSheet from "../components/EditUserSheet";

export default function UserDetailPage() {
  const { userId = "" } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // 1. Queries
  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError,
  } = useGetUserDetail(userId);

  const { data: activitiesResponse, isLoading: isActivitiesLoading } =
    useGetUserActivities(userId);

  const user = userResponse?.data;
  const activities = activitiesResponse?.data?.data ?? [];

  // 2. Loading State
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

  // 3. In-Page 404 Not Found State
  if (isError || !user) {
    return <UserNotFoundState />;
  }

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    "No name provided";

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-12 space-y-6">
      {/* Back Button */}
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

      {/* Header Profile Title + Badges + Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <Typography
              variant="h1"
              className="text-2xl md:text-3xl font-bold text-sidebar-bg"
            >
              {fullName}
            </Typography>

            {/* Role Badge */}
            {user.role === UserRole.Admin ? (
              <Badge className="bg-role-admin-bg text-role-admin-text border-role-admin-text/15">
                Admin
              </Badge>
            ) : (
              <Badge className="bg-role-user-bg text-role-user-text border-role-user-text/15">
                User
              </Badge>
            )}

            {/* Status Badge */}
            <Badge variant={user.isActive ? "primary" : "danger"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
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
          <Pencil className="w-4 h-4 mr-1.5" />
          <Typography variant="body" className="font-semibold text-white">
            Edit user
          </Typography>
        </Button>
      </div>

      {/* Profile Information Sub-component */}
      <UserProfileInfo user={user} />

      {/* Activity Timeline Sub-component (Real API Data Only) */}
      <UserActivityTimeline
        activities={activities}
        isLoading={isActivitiesLoading}
      />

      {/* Edit Slide-over Drawer */}
      <EditUserSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        user={user}
      />
    </div>
  );
}
