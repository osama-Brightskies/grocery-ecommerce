import { Typography } from "@/components/ui/shared/Typography";
import { useAuthStore } from "../../store/useAuthStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-surface-soft p-8 font-sans antialiased">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="bg-white p-8 rounded-xl border border-border-input shadow-sm space-y-4">
          <Typography variant="h1" className="text-brand-primary font-bold">
            Freshly Admin Dashboard 🌿
          </Typography>
          <Typography variant="muted" className="text-text-secondary">
            You are successfully authenticated and inside the protected main
            app!
          </Typography>

          {/* User Profile Card */}
          <div className="p-4 bg-surface-soft rounded-lg border border-border-input space-y-2 text-xs font-mono">
            <p className="text-sidebar-bg font-bold">Zustand Store Payload:</p>
            <p>
              <span className="text-text-secondary">userId:</span>{" "}
              <span className="text-brand-primary font-semibold">
                {user?.userId || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-text-secondary">role:</span>{" "}
              <span className="text-brand-primary font-semibold">
                {user?.role !== undefined ? user.role : "N/A"}
              </span>
            </p>
            <p>
              <span className="text-text-secondary">isAuthenticated:</span>{" "}
              <span className="text-brand-primary font-semibold">
                {String(isAuthenticated)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
