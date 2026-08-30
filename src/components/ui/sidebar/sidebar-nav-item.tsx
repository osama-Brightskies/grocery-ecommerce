import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export type SidebarNavItemProps = {
  title: string;
  icon: React.ElementType;
  navLink: string;
  isCollapsed?: boolean;
  className?: string;
};

export function SidebarNavItem({
  title,
  icon: Icon,
  navLink,
  isCollapsed = false,
  className,
}: SidebarNavItemProps) {
  const location = useLocation();

  const isActive =
    location.pathname === navLink ||
    (navLink !== "/" && location.pathname.startsWith(navLink));

  return (
    <div className="relative group/tooltip flex items-center w-full">
      <Link
        to={navLink}
        className={cn(
          "w-full flex items-center rounded-lg text-sm font-medium transition-all cursor-pointer select-none whitespace-nowrap",
          isCollapsed ? "justify-center px-0 py-3" : "gap-3.5 px-4 py-3",
          isActive
            ? "bg-brand-primary text-white shadow-sm"
            : "text-text-subtle hover:text-white hover:bg-sidebar-button",
          className,
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {!isCollapsed && <span>{title}</span>}
      </Link>

      {/* Brand Green Themed Tooltip */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#141C18] text-surface-mint text-xs font-semibold rounded-[7px] border border-brand-primary/60 shadow-lg shadow-brand-primary/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
          {title}
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#141C18] border-l border-b border-brand-primary/60 rotate-45" />
        </div>
      )}
    </div>
  );
}

export default SidebarNavItem;
