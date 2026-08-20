import { SidebarNavItem } from "./sidebar/sidebar-nav-item";
import { SidebarUserCard } from "./sidebar/sidebar-user-card";
import { SidebarLogoutButton } from "./sidebar/sidebar-logout-button";
import { navItems } from "./sidebar/sidebar.const";

export interface SidebarProps {
  brandTitle?: string;
  brandSubtitle?: string;
  className?: string;
}

export function Sidebar({
  brandTitle = "freshly",
  brandSubtitle = "GROCERY ADMIN",
  className,
}: SidebarProps) {
  // TODO: Implement routing / navigation handling via React Router

  const handleLogout = () => {
    console.log("Logged out successfully");
  };

  return (
    <aside
      className={`w-64 h-screen bg-sidebar-bg flex flex-col justify-between p-4 select-none shrink-0 font-sans sticky top-0 ${
        className || ""
      }`}
    >
      <div className="space-y-8">
        <div className="px-3 pt-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {brandTitle}
          </h1>
          <p className="text-[10px] font-bold tracking-wider text-text-subtle uppercase mt-0.5">
            {brandSubtitle}
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

      <div className="space-y-4 pt-4 border-t border-sidebar-button/40">
        <SidebarUserCard />
        <SidebarLogoutButton onLogout={handleLogout} />
      </div>
    </aside>
  );
}

export default Sidebar;
