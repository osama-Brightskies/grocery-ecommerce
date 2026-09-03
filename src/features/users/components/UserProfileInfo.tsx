import { useState } from "react";
import { User as UserIcon, Copy, Check } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UserRole } from "@/store/types/authStore.types";
import { formatDateTime } from "@/lib/utils";
import type { User } from "../types/users.types";
import { toast } from "sonner";

export type UserProfileInfoProps = {
  user: User;
};

export function UserProfileInfo({ user }: UserProfileInfoProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyGuid = () => {
    if (!user.guid) return;
    navigator.clipboard.writeText(user.guid);
    setIsCopied(true);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <UserIcon className="w-5 h-5 text-sidebar-bg" />
        <Typography variant="h3" className="font-semibold text-sidebar-bg">
          Profile information
        </Typography>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
        {/* First name */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <Typography variant="muted" className="w-36 text-text-secondary">
            First name
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {user.firstName || "—"}
          </Typography>
        </div>

        {/* Last name */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <Typography variant="muted" className="w-36 text-text-secondary">
            Last name
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {user.lastName || "—"}
          </Typography>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <Typography variant="muted" className="w-36 text-text-secondary">
            Email
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {user.email}
          </Typography>
        </div>

        {/* Phone number */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <Typography variant="muted" className="w-36 text-text-secondary">
            Phone number
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {user.phoneNumber || "—"}
          </Typography>
        </div>

        {/* Role */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <Typography variant="muted" className="w-36 text-text-secondary">
            Role
          </Typography>
          <div>
            {user.role === UserRole.Admin ? (
              <Badge className="bg-role-admin-bg text-role-admin-text border-role-admin-text/15">
                Admin
              </Badge>
            ) : (
              <Badge className="bg-role-user-bg text-role-user-text border-role-user-text/15">
                User
              </Badge>
            )}
          </div>
        </div>

        {/* User ID with Shadcn Tooltip */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <Typography variant="muted" className="w-36 text-text-secondary">
            User ID
          </Typography>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopyGuid}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <Typography
                  variant="body"
                  className="font-mono text-xs text-text-secondary group-hover:text-sidebar-bg transition-colors"
                >
                  {user.guid.slice(0, 8)}...{user.guid.slice(-6)}
                </Typography>
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-text-secondary group-hover:text-sidebar-bg transition-colors shrink-0" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="font-mono text-surface-mint">{user.guid}</span>
              <span className="text-[10px] text-text-secondary border-l border-white/20 pl-1.5 ml-1.5">
                Click to copy
              </span>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Joined Date */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <Typography variant="muted" className="w-36 text-text-secondary">
            Joined
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {formatDateTime(user.createdAt)}
          </Typography>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between py-2">
          <Typography variant="muted" className="w-36 text-text-secondary">
            Status
          </Typography>
          <div>
            <Badge variant={user.isActive ? "primary" : "danger"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileInfo;
