import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui/sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface-soft font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Dynamic Main App Page Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
