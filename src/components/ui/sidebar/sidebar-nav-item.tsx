import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface SidebarNavItemProps {
  title: string;
  icon: React.ElementType;
  navLink: string;
  className?: string;
}

export function SidebarNavItem({
  title,
  icon: Icon,
  navLink,
  className,
}: SidebarNavItemProps) {
  const location = useLocation();
  const isActive = location.hash === navLink || location.pathname === navLink;

  return (
    <Link
      to={navLink}
      className={cn(
        "w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none",
        isActive
          ? "bg-brand-primary text-white shadow-sm"
          : "text-text-subtle hover:text-white hover:bg-sidebar-button",
        className
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{title}</span>
    </Link>
  );
}

export default SidebarNavItem;