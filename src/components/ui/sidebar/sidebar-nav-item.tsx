import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarNavItemProps {
  title: string;
  icon: React.ElementType;
  navLink: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SidebarNavItem({
  title,
  icon: Icon,
  navLink,
  isActive = false,
  onClick,
  className,
}: SidebarNavItemProps) {
  return (
    <a
      href={navLink}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none",
        isActive
          ? "bg-brand-primary text-white shadow-sm"
          : "text-text-subtle hover:text-white hover:bg-sidebar-button",
        className,
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{title}</span>
    </a>
  );
}

export default SidebarNavItem;
