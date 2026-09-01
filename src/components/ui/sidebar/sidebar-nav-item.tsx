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
    <div className="relative group flex items-center w-full group-hover:z-50">
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

      {/* Flyout Tooltip with Dark #141C18 Triangle */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-100">
          {/* Dark Triangle Pointer */}
          <div className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-[#141C18] shrink-0 -mr-px" />

          {/* Dark Tooltip Body */}
          <div className="px-3 py-1.5 bg-[#141C18] text-surface-mint text-xs font-semibold rounded-[7px] border border-brand-primary shadow-lg shadow-black/50 whitespace-nowrap">
            {title}
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarNavItem;
