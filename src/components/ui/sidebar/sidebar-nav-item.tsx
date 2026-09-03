import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/shared/Typography";
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

  const content = (
    <Link
      to={navLink}
      className={cn(
        "w-full flex items-center rounded-lg text-sm font-medium transition-all cursor-pointer select-none whitespace-nowrap",
        {
          "justify-center px-0 py-3": isCollapsed,
          "gap-3.5 px-4 py-3": !isCollapsed,
          "bg-brand-primary text-white shadow-xs": isActive,
          "text-text-subtle hover:text-white hover:bg-sidebar-button":
            !isActive,
        },
        className,
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!isCollapsed && (
        <Typography className="text-sm font-medium text-inherit">
          {title}
        </Typography>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export default SidebarNavItem;
