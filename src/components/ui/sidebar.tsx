import { SidebarNavItem } from "./sidebar/sidebar-nav-item";
import { SidebarUserCard } from "./sidebar/sidebar-user-card";
import { SidebarLogoutButton } from "./sidebar/sidebar-logout-button";
import { navItems } from "./sidebar/sidebar.const";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SidebarProps = {
  brandTitle?: string;
  brandSubtitle?: string;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function Sidebar({
  brandTitle = "freshly",
  brandSubtitle = "GROCERY ADMIN",
  className = "",
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={`z-50 h-screen bg-sidebar-bg flex flex-col justify-between select-none shrink-0 font-sans sticky top-0 border-r border-white/10 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16 p-2" : "w-64 p-4"
      } ${className}`}
    >
      <div className="space-y-8">
        {/* Brand Header & Toggle Button */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center pt-2" : "justify-between px-3 pt-2"
          }`}
        >
          {!isCollapsed ? (
            <>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {brandTitle}
                </h1>
                <p className="text-[10px] font-bold tracking-wider text-text-subtle uppercase mt-0.5">
                  {brandSubtitle}
                </p>
              </div>
              {onToggleCollapse && (
                <div className="relative group/tooltip flex items-center">
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="text-text-subtle hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {/* Expanded Mode Tooltip */}
                  <div className="absolute right-0 top-full mt-2 px-2.5 py-1 bg-[#141C18] text-surface-mint text-xs font-semibold rounded-[7px] border border-brand-primary/60 shadow-lg shadow-brand-primary/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                    Collapse Sidebar
                  </div>
                </div>
              )}
            </>
          ) : (
            onToggleCollapse && (
              <div className="relative group/tooltip flex items-center justify-center">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="text-text-subtle hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Collapsed Mode Themed Tooltip Bubble */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#141C18] text-surface-mint text-xs font-semibold rounded-[7px] border border-brand-primary/60 shadow-lg shadow-brand-primary/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                  Expand Sidebar
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#141C18] border-l border-b border-brand-primary/60 rotate-45" />
                </div>
              </div>
            )
          )}
        </div>

        {/* Nav Items */}
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

      {/* Footer / User & Logout */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <SidebarUserCard isCollapsed={isCollapsed} />
        <SidebarLogoutButton isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}

export default Sidebar;
