import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/logout/hooks/useLogout";
import { Typography } from "@/components/ui/shared/Typography";
import Button from "../button";

export interface SidebarLogoutButtonProps {
  isCollapsed?: boolean;
  onLogout?: () => void;
  className?: string;
}

export function SidebarLogoutButton({
  isCollapsed = false,
  onLogout,
  className,
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
      // Catch network errors
    } finally {
      Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
      Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
      clearAuth();
      onLogout?.();
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div className="relative group/tooltip flex items-center w-full">
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={isPending}
        className={cn(
          "w-full flex items-center border-none shadow-none bg-transparent outline-none transition-all cursor-pointer select-none whitespace-nowrap h-auto",
          "text-text-subtle hover:text-white hover:bg-sidebar-button focus:bg-sidebar-button",
          isCollapsed
            ? "justify-center px-0 py-3"
            : "justify-start gap-3.5 px-4 py-3",
          className,
        )}
      >
        <LogOut className="w-5 h-5 shrink-0" />
        {!isCollapsed && (
          <Typography className="text-sm font-medium text-inherit">
            {isPending ? "Logging out..." : "Logout"}
          </Typography>
        )}
      </Button>

      {/* Brand Green Themed Tooltip */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#141C18] text-status-danger-text text-xs font-semibold rounded-[7px] border border-status-danger-text/60 shadow-lg shadow-status-danger-text/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
          <Typography className="text-xs font-semibold text-status-danger-text">
            Logout
          </Typography>
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#141C18] border-l border-b border-status-danger-text/60 rotate-45" />
        </div>
      )}
    </div>
  );
}

export default SidebarLogoutButton;
