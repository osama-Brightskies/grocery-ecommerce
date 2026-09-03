import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/logout/hooks/useLogout";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SidebarLogoutButtonProps = {
  isCollapsed?: boolean;
  onLogout?: () => void;
  className?: string;
};

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
      // Catch network failure gracefully
    } finally {
      Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
      Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
      clearAuth();
      onLogout?.();
      navigate("/auth/login", { replace: true });
    }
  };

  const buttonContent = (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        "w-full flex items-center border-none shadow-none bg-transparent outline-none transition-all cursor-pointer select-none whitespace-nowrap h-auto",
        "text-text-subtle hover:text-white hover:bg-sidebar-button focus:bg-sidebar-button",
        {
          "justify-center px-0 py-3": isCollapsed,
          "justify-start gap-3.5 px-4 py-3": !isCollapsed,
        },
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
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent side="right">Logout</TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
}

export default SidebarLogoutButton;
