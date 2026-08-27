import * as React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";
import { useAuthStore } from "../../../store/useAuthStore";
import { useLogout } from "../../../features/auth/logout/hooks/useLogout";
import { Button } from "../button"; // Imported our Shadcn Button component

export interface SidebarLogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onLogout?: () => void;
}

export function SidebarLogoutButton({
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
      // 1. Attempt API call to invalidate refresh token on backend
      await logoutAsync();
    } catch {
      // Catch any network errors (handled by onError toast)
    } finally {
      // 2. FINALLY ALWAYS EXECUTES INSTANTLY: Wipes cookies, resets Zustand, and redirects
      clearAuth();
      onLogout?.();
      navigate("/auth/login");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        "w-full flex items-center justify-start gap-3 px-4 py-3 h-auto",
        "rounded-lg text-sm font-medium text-text-subtle",
        "bg-sidebar-button hover:text-white hover:bg-sidebar-button/80 transition-colors select-none cursor-pointer",
        className,
      )}
      {...props}
    >
      <LogOut className="w-5 h-5 shrink-0" />
      <span>{isPending ? "Logging out..." : "Logout"}</span>
    </Button>
  );
}

export default SidebarLogoutButton;
