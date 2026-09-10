import { Calendar, Pencil } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials, cn } from "@/lib/utils";
import type { User } from "../types/users.types";

export type UserProfileInfoProps = {
  user: User;
  onEdit: () => void;
};

export function UserProfileInfo({ user, onEdit }: UserProfileInfoProps) {
  const initials = getInitials(user.firstName, user.lastName, user.email);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
      {/* 1. Header: Avatar + Title + Subtitle + Top-Right "Edit user" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3.5">
          <Avatar
            size="default"
            className="bg-surface-mint text-brand-primary border border-brand-primary/20"
          >
            <AvatarFallback className="font-bold text-brand-primary bg-surface-mint text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <Typography variant="h3" className="font-bold text-sidebar-bg">
              Profile information
            </Typography>
            <Typography variant="muted" className="text-xs text-text-secondary">
              User details and account information
            </Typography>
          </div>
        </div>

        {/* Edit User Button inside the Card Header */}
        <Button
          variant="outline"
          size="default"
          onClick={onEdit}
          className="bg-surface-mint text-brand-primary border-brand-primary/25 hover:bg-surface-mint/80 font-semibold shadow-2xs cursor-pointer transition-all"
        >
          <Pencil className="w-4 h-4 mr-1.5" />
          <span>Edit user</span>
        </Button>
      </div>

      {/* 2. 3-Column Fields Grid matching Figma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-sm">
        {/* Column 1: Names */}
        <div className="space-y-4">
          <div>
            <Typography variant="muted" className="text-xs text-text-secondary">
              First name
            </Typography>
            <Typography
              variant="body"
              className="font-bold text-sidebar-bg text-sm mt-0.5"
            >
              {user.firstName || "—"}
            </Typography>
          </div>

          <div>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Last name
            </Typography>
            <Typography
              variant="body"
              className="font-bold text-sidebar-bg text-sm mt-0.5"
            >
              {user.lastName || "—"}
            </Typography>
          </div>
        </div>

        {/* Column 2: Contacts */}
        <div className="space-y-4">
          <div>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Email address
            </Typography>
            <Typography
              variant="body"
              className="font-bold text-sidebar-bg text-sm mt-0.5 truncate"
              title={user.email}
            >
              {user.email}
            </Typography>
          </div>

          <div>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Phone number
            </Typography>
            <Typography
              variant="body"
              className="font-bold text-sidebar-bg text-sm mt-0.5 font-mono"
            >
              {user.phoneNumber || "—"}
            </Typography>
          </div>
        </div>

        {/* Column 3: Dates & Status */}
        <div className="space-y-4">
          <div>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Joined date
            </Typography>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-text-secondary" />
              <Typography
                variant="body"
                className="font-bold text-sidebar-bg text-sm"
              >
                {formatDate(user.createdAt)}
              </Typography>
            </div>
          </div>

          <div>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Status
            </Typography>
            <div className="mt-1">
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
                    user.isActive
                      ? "bg-brand-primary"
                      : "bg-status-danger-text",
                  )}
                />
                <span>{user.isActive ? "Active" : "Inactive"}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileInfo;
