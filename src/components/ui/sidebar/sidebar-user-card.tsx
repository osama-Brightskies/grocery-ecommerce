import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/store/types/authStore.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/shared/Typography";
import { useGetUserDetail } from "@/features/users/hooks/useGetUserDetail";
import { getInitials, cn } from "@/lib/utils";

export type SidebarUserCardProps = {
  isCollapsed?: boolean;
  className?: string;
};

export function SidebarUserCard({
  isCollapsed = false,
  className,
}: SidebarUserCardProps) {
  const authUser = useAuthStore((state) => state.user);

  // Fetch logged-in admin's profile data dynamically
  const { data: userProfile } = useGetUserDetail(authUser?.userId ?? "");
  const profile = userProfile?.data;

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
    "Admin User";
  const roleText = authUser?.role === UserRole.Admin ? "Administrator" : "User";
  const initials = getInitials(
    profile?.firstName,
    profile?.lastName,
    profile?.email,
  );

  const cardContent = (
    <div
      className={cn(
        "flex items-center select-none",
        {
          "justify-center py-1": isCollapsed,
          "gap-3 px-3 py-2": !isCollapsed,
        },
        className,
      )}
    >
      {/* Dynamic Initials Avatar */}
      <Avatar
        size={isCollapsed ? "sm" : "default"}
        className="bg-avatar-emerald text-white"
      >
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {/* Dynamic Name & Role */}
      {!isCollapsed && (
        <div className="flex flex-col min-w-0">
          <Typography
            variant="body"
            className="text-sm font-bold text-white truncate"
          >
            {fullName}
          </Typography>
          <Typography
            variant="muted"
            className="text-xs text-text-subtle truncate"
          >
            {roleText}
          </Typography>
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent side="right">
          {fullName} ({roleText})
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
}

export default SidebarUserCard;
