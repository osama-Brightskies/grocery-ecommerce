import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-surface-soft font-sans antialiased">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Dynamic Main Content with Symmetrical Padding */}
        <main className="flex-1 min-w-0 overflow-y-auto p-8 transition-all duration-300 relative z-0">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
