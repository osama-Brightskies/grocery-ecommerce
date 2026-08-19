import { Typography } from "./components/Typography";
import FormEx from "./features/products/add/FormEx";
import Button from "./components/ui/button";
import { Sidebar } from "./components/ui/sidebar";

export default function App() {
  // --- MOCK DATA ---
  const categoryOptions = [
    { label: "Fruits", value: "1" },
    { label: "Vegetables", value: "2" },
  ];

  const unitOptions = [
    { label: "per kg", value: "kg" },
    { label: "per pc", value: "pc" },
  ];

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

          {/* ==========================================
              SECTION 2: DROPDOWN (LABELED SELECT) SHOWCASE 
              ========================================== */}
          <div className="rounded-xl border border-border-input bg-white p-8 shadow-sm space-y-10">
            <div>
              <Typography variant="h2" className="text-sidebar-bg">
                Component: Labeled Select
              </Typography>
              <Typography variant="muted">
                Testing populated, empty, and undefined data states.
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* CASE 1: Populated Category */}
              <div className="space-y-3">
                <Typography variant="caption" className="text-brand-primary">
                  Case 1: Category
                </Typography>
                <LabeledSelect
                  label="Category"
                  placeholder="Fruits"
                  options={categoryOptions}
                />
              </div>

              {/* CASE 2: Populated Unit */}
              <div className="space-y-3">
                <Typography variant="caption" className="text-brand-primary">
                  Case 2: Unit
                </Typography>
                <LabeledSelect
                  label="Unit"
                  placeholder="per kg"
                  options={unitOptions}
                />
              </div>

              {/* CASE 3: Undefined / No Values */}
              <div className="space-y-3">
                <Typography
                  variant="caption"
                  className="text-status-danger-text"
                >
                  Case 3: No Values
                </Typography>
                <LabeledSelect
                  label="Empty List"
                  placeholder="No data..."
                  options={undefined}
                />
              </div>
            </div>

            {/* ==========================================
                FIGMA VISUAL VERIFICATION (Footer Section)
                ========================================== */}
            <div className="pt-6 border-t border-border-input flex justify-between items-end">
              <div className="space-y-1">
                <Typography variant="caption">
                  Figma Width Reference (330px each)
                </Typography>
                <div className="flex gap-4">
                  <div className="h-1 bg-brand-primary w-82.5 rounded-full opacity-20"></div>
                  <div className="h-1 bg-brand-primary w-82.5 rounded-full opacity-20"></div>
                </div>
              </div>

              <Typography variant="muted" className="text-[10px]">
                Styles: 44px height | 7px radius | #E0E8E0 border
              </Typography>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
