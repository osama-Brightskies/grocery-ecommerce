import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export interface SidebarUserCardProps {
  className?: string;
}

export function SidebarUserCard({ className }: SidebarUserCardProps) {
  const user = useAuthStore((state) => state.user);

  // Derive role title (1 = Administrator, 0 = User)
  const roleName = user?.role === 1 ? "Administrator" : "User";

  // Display user ID segment or fallback
  const displayName = user?.userId
    ? `Admin (${user.userId.slice(0, 8)})`
    : "Administrator";

  return (
    <div className={cn("flex items-center gap-3 px-2 select-none", className)}>
      <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
        AD
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-tight">
          {displayName}
        </p>
        <p className="text-xs text-text-subtle truncate">{roleName}</p>
      </div>
    </div>
  );
}

export default SidebarUserCard;
