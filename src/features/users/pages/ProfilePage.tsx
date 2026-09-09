import { useState } from "react";
import { Mail } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";

import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/store/types/authStore.types";
import { useGetUserDetail } from "../hooks/useGetUserDetail";

import UserProfileInfo from "../components/UserProfileInfo";
import UserNotFoundState from "../components/UserNotFoundState";
import EditUserSheet from "../components/EditUserSheet";
import PageHeader from "@/components/ui/shared/page-header";

export default function ProfilePage() {
  const authUser = useAuthStore((state) => state.user);
  const userId = authUser?.userId ?? "";

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError,
  } = useGetUserDetail(userId);

  const user = userResponse?.data;

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <Typography variant="muted">Loading your profile...</Typography>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <UserNotFoundState />;
  }

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    "No name provided";

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your personal account details"
      />

      <div className="space-y-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          <Typography
            variant="h1"
            className="text-2xl md:text-3xl font-bold text-sidebar-bg"
          >
            {fullName}
          </Typography>

          {user.role === UserRole.Admin ? (
            <Badge className="bg-role-admin-bg text-role-admin-text border-role-admin-text/15">
              Admin
            </Badge>
          ) : (
            <Badge className="bg-role-user-bg text-role-user-text border-role-user-text/15">
              User
            </Badge>
          )}

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

      <UserProfileInfo user={user} onEdit={() => setIsEditSheetOpen(true)} />

      <EditUserSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        user={user}
        title="Edit Profile"
      />
    </div>
  );
}
