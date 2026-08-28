import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export interface SidebarUserCardProps {
  isCollapsed?: boolean;
  className?: string;
}

export function SidebarUserCard({
  isCollapsed = false,
  className,
}: SidebarUserCardProps) {
  const user = useAuthStore((state) => state.user);

  const roleName = user?.role === 1 ? "Administrator" : "User";
  const displayName = user?.userId
    ? `Admin (${user.userId.slice(0, 8)})`
    : "Administrator";

  return (
    <div className="relative group/tooltip flex items-center w-full">
      <div
        className={cn(
          "w-full flex items-center select-none",
          isCollapsed ? "justify-center px-0" : "gap-3 px-2",
          className,
        )}
      >
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
          AD
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-text-subtle truncate">{roleName}</p>
          </div>
        )}
      </div>

      {/* Brand Green Themed Tooltip */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#141C18] text-surface-mint text-xs font-semibold rounded-[7px] border border-brand-primary/60 shadow-lg shadow-brand-primary/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
          {displayName} ({roleName})
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#141C18] border-l border-b border-brand-primary/60 rotate-45" />
        </div>
      )}
    </div>
  );
}

export default SidebarUserCard;
