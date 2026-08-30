import { Typography } from "@/components/ui/shared/Typography";
import { UserRole } from "@/store/types/authStore.types";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Derive human-readable role string using UserRole enum
  const roleDisplay =
    user?.role === UserRole.Admin
      ? `Administrator (${UserRole.Admin})`
      : user?.role === UserRole.User
        ? `User (${UserRole.User})`
        : "N/A";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="bg-white p-8 rounded-[7px] border border-border-input shadow-sm space-y-4">
        <Typography variant="h1" className="text-brand-primary font-bold">
          Freshly Admin Dashboard 🌿
        </Typography>
        <Typography variant="muted" className="text-text-secondary">
          You are successfully authenticated and inside the protected main app!
        </Typography>

        {/* User Profile Card */}
        <div className="p-4 bg-surface-soft rounded-[7px] border border-border-input space-y-2 text-xs font-mono">
          <Typography className="text-sidebar-bg font-bold">
            Zustand Store Payload:
          </Typography>

          <p className="text-text-secondary">
            userId:{" "}
            <span className="text-brand-primary font-semibold">
              {user?.userId || "N/A"}
            </span>
          </p>

          <p className="text-text-secondary">
            role:{" "}
            <span className="text-brand-primary font-semibold">
              {roleDisplay}
            </span>
          </p>

          <p className="text-text-secondary">
            isAuthenticated:{" "}
            <span className="text-brand-primary font-semibold">
              {String(isAuthenticated)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
