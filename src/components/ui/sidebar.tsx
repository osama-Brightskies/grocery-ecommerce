import * as React from "react";
import { cn } from "@/lib/utils";
import navItems from "./sidebar/sidebar.const";
import SidebarNavItem from "./sidebar/sidebar-nav-item";
import SidebarUserCard from "./sidebar/sidebar-user-card";
import SidebarLogoutButton from "./sidebar/sidebar-logout-button";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  onLogout?: () => void;
}

export function Sidebar({ onLogout, className, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-55 bg-sidebar-bg text-white flex flex-col justify-between p-5 shrink-0 min-h-screen select-none border-r border-border/10",
        className,
      )}
      {...props}
    >
      <div>
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-wider text-white">
            freshly
          </h1>
          <p className="text-[10px] tracking-widest text-text-subtle font-semibold uppercase mt-0.5">
            Grocery Admin
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              navLink={item.navLink}
            />
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/10 space-y-3">
        <SidebarUserCard />
        <SidebarLogoutButton
          onLogout={onLogout || (() => console.log("Logged out"))}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
