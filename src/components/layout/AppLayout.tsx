import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return savedState !== null ? JSON.parse(savedState) : false;
    } catch {
      return false;
    }
  });

  // 2. Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        JSON.stringify(isSidebarCollapsed),
      );
    } catch {
      // Handle private browsing or quota limits gracefully
    }
  }, [isSidebarCollapsed]);

  const toggleSidebar = (): void => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen bg-surface-soft font-sans antialiased">
        {/* Sidebar Navigation */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        {/* Dynamic Main App Page Content */}
        <main className="flex-1 min-w-0 overflow-y-auto p-8 transition-all duration-300 relative z-0">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
