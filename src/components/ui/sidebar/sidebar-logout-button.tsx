import * as React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarLogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onLogout?: () => void;
}

export function SidebarLogoutButton({
  onLogout,
  className,
  ...props
}: SidebarLogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-subtle bg-sidebar-button hover:text-white hover:bg-sidebar-button/80 transition-colors select-none",
        className,
      )}
      {...props}
    >
      <LogOut className="w-5 h-5 shrink-0" />
      <span>Logout</span>
    </button>
  );
}

export default SidebarLogoutButton;
