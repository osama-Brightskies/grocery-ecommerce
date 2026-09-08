import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/shared/Typography";
import { cn } from "@/lib/utils";
import { navItems } from "./sidebar/sidebar.const";
import SidebarNavItem from "./sidebar/sidebar-nav-item";
import SidebarUserCard from "./sidebar/sidebar-user-card";
import SidebarLogoutButton from "./sidebar/sidebar-logout-button";

export type SidebarProps = {
  brandTitle?: string;
  brandSubtitle?: string;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function Sidebar({
  brandTitle = "Big Cart",
  brandSubtitle = "GROCERY ADMIN",
  className,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "z-50 h-screen bg-sidebar-bg flex flex-col justify-between select-none shrink-0 font-sans sticky top-0 border-r border-white/10 transition-all duration-300 ease-in-out",
          {
            "w-16 p-2": isCollapsed,
            "w-64 p-4": !isCollapsed,
          },
          className,
        )}
      >
        <div className="space-y-8">
          <div
            className={cn("flex pt-2", {
              "flex-col items-center gap-4 justify-center": isCollapsed,
              "items-center justify-between px-3": !isCollapsed,
            })}
          >
            {!isCollapsed ? (
              <>
                <div>
                  <Typography
                    variant="h1"
                    className="text-2xl font-bold text-white tracking-tight"
                  >
                    {brandTitle}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-[10px] font-bold tracking-wider text-text-subtle uppercase mt-0.5"
                  >
                    {brandSubtitle}
                  </Typography>
                </div>
                {onToggleCollapse && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="text-text-subtle hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Collapse Sidebar
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            ) : (
              <>
                <img
                  src="/IMG-20260908-WA0046.jpg"
                  alt="Brand Logo"
                  className="w-12 h-12 object-contain drop-shadow-md transition-transform hover:scale-105"
                />
                {onToggleCollapse && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="text-text-subtle hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Expand Sidebar</TooltipContent>
                  </Tooltip>
                )}
              </>
            )}
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                navLink={item.navLink}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10">
          <SidebarUserCard isCollapsed={isCollapsed} />
          <SidebarLogoutButton isCollapsed={isCollapsed} />
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default Sidebar;
