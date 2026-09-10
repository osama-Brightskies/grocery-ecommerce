import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "sidebar-collapsed",
      JSON.stringify(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  const toggleSidebar = (): void => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen bg-surface-soft font-sans antialiased">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        <main className="flex-1 min-w-0 overflow-y-auto p-8 transition-all duration-300 relative z-0">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
