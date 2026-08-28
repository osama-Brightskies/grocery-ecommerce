import * as React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/logout/hooks/useLogout";
import { Button } from "../button";

export interface SidebarLogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isCollapsed?: boolean;
  onLogout?: () => void;
}

export function SidebarLogoutButton({
  isCollapsed = false,
  onLogout,
  className,
  ...props
}: SidebarLogoutButtonProps) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { mutateAsync: logoutAsync, isPending } = useLogout({
    onSuccess: () => {
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  const handleLogout = async () => {
    try {
      await logoutAsync();
    } catch {
      // Catch network error
    } finally {
      clearAuth();
      onLogout?.();
      navigate("/auth/login");
    }
  };

  return (
    <div className="relative group/tooltip flex items-center w-full">
      <Button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className={cn(
          "w-full flex items-center h-auto rounded-lg text-sm font-medium text-text-subtle",
          "bg-sidebar-button hover:text-white hover:bg-sidebar-button/80 transition-colors select-none cursor-pointer",
          isCollapsed
            ? "justify-center px-0 py-3"
            : "justify-start gap-3 px-4 py-3",
          className,
        )}
        {...props}
      >
        <LogOut className="w-5 h-5 shrink-0" />
        {!isCollapsed && <span>{isPending ? "Logging out..." : "Logout"}</span>}
      </Button>

      {/* Brand Green Themed Tooltip */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#141C18] text-status-danger-text text-xs font-semibold rounded-[7px] border border-status-danger-text/60 shadow-lg shadow-status-danger-text/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
          Logout
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#141C18] border-l border-b border-status-danger-text/60 rotate-45" />
        </div>
      )}
    </div>
  );
}

export default SidebarLogoutButton;
