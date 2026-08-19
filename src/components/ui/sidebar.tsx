import * as React from "react";
import {
  LayoutGrid,
  Package,
  FolderClosed,
  Clock,
  Settings,
} from "lucide-react";
import { SidebarNavItem } from "./sidebar/sidebar-nav-item";
import { SidebarUserCard } from "./sidebar/sidebar-user-card";
import { SidebarLogoutButton } from "./sidebar/sidebar-logout-button";

const navItems = [
  { title: "Overview", navLink: "#overview", icon: LayoutGrid },
  { title: "Products", navLink: "#products", icon: Package },
  { title: "Categories", navLink: "#categories", icon: FolderClosed },
  { title: "Orders", navLink: "#orders", icon: Clock },
  { title: "Settings", navLink: "#settings", icon: Settings },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  const handleNavClick = (title: string, navLink: string) => {
    setActiveItem(title);
    window.history.pushState(null, "", navLink);
  };

  const handleLogout = () => {
    console.log("Logged out successfully");
  };

  return (
    <aside className="w-64 h-screen bg-sidebar-bg flex flex-col justify-between p-4 select-none shrink-0 font-sans sticky top-0">
      <div className="space-y-8">
        <div className="px-3 pt-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            freshly
          </h1>
          <p className="text-[10px] font-bold tracking-wider text-text-subtle uppercase mt-0.5">
            GROCERY ADMIN
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              navLink={item.navLink}
              isActive={activeItem === item.title}
              onClick={() => handleNavClick(item.title, item.navLink)}
            />
          ))}
        </nav>
      </div>

      {/* User Info & Actions */}
      <div className="space-y-4 pt-4 border-t border-sidebar-button/40">
        <SidebarUserCard name="Ahmed Tamim" role="Administrator" initials="AT" />
        <SidebarLogoutButton onLogout={handleLogout} />
      </div>
    </aside>
  );
}

export default Sidebar;
