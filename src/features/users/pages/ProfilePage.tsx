import { useState } from "react";
import { Typography } from "@/components/ui/shared/Typography";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetUserDetail } from "../hooks/useGetUserDetail";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { UserNotFoundState } from "../components/UserNotFoundState";
import EditUserSheet from "../components/EditUserSheet";

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
      <div className="flex items-center justify-center min-h-100">
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

  return (
    <div className="w-full space-y-6 pb-16">
      {/* 1. Page Title */}
      <div className="space-y-1">
        <Typography
          variant="h1"
          className="text-2xl md:text-3xl font-bold text-sidebar-bg"
        >
          My Profile
        </Typography>
        <Typography variant="muted" className="text-sm text-text-secondary">
          View and manage your personal administrator account details
        </Typography>
      </div>

      {/* 2. Redesigned UserProfileInfo Card (Contains Avatar + Edit Button) */}
      <UserProfileInfo user={user} onEdit={() => setIsEditSheetOpen(true)} />

      {/* 3. Edit Drawer */}
      <EditUserSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        user={user}
      />
    </div>
  );
}
