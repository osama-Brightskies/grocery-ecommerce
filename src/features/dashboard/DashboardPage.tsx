import { Typography } from "@/components/ui/shared/Typography";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface-soft p-8 font-sans antialiased">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="bg-white p-8 rounded-xl border border-border-input shadow-sm space-y-3">
          <Typography variant="h1" className="text-brand-primary font-bold">
            Freshly Admin Dashboard 🌿
          </Typography>
          <Typography variant="muted" className="text-text-secondary">
            Welcome! You are successfully authenticated and inside the protected
            main app.
          </Typography>
        </div>
      </div>
    </div>
  );
}
