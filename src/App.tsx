import { Typography } from "./components/Typography";
import Button from "./components/ui/button";
import { Sidebar } from "./components/ui/sidebar";

export default function App() {
  return (
    <div className="flex min-h-screen bg-surface-soft font-sans antialiased">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* ==========================================
              SECTION 1: TYPOGRAPHY SHOWCASE 
              ========================================== */}
          <div className="space-y-4">
            <Typography variant="h1" className="text-brand-primary">
              Freshly Design System 🌿
            </Typography>
            <Typography variant="muted" className="mt-1">
              Standardizing typography, colors, and components for the Grocery
              Admin.
            </Typography>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg">
                Save changes
              </Button>
              <Button variant="outline" size="md">
                Cancel
              </Button>
              <Button variant="danger" size="default">
                Delete item
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-border-input bg-white p-6 shadow-sm space-y-4">
              <Typography
                variant="h3"
                className="text-brand-primary border-b border-border-input pb-2"
              >
                Typography Variants
              </Typography>
              <div className="space-y-2">
                <Typography variant="h1">Heading 1</Typography>
                <Typography variant="h2">Heading 2</Typography>
                <Typography variant="body">Body paragraph text</Typography>
                <Typography variant="label">Input Field Label</Typography>
              </div>
            </div>

            <div className="rounded-xl border border-border-input bg-white p-6 shadow-sm space-y-4">
              <Typography
                variant="h3"
                className="text-brand-primary border-b border-border-input pb-2"
              >
                Status Tokens
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 rounded bg-status-warning-bg flex items-center justify-center text-status-warning-text text-[10px] font-bold">
                  WARNING
                </div>
                <div className="h-10 rounded bg-status-danger-bg flex items-center justify-center text-status-danger-text text-[10px] font-bold">
                  DANGER
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}