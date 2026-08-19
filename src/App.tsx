import { Typography } from "./components/Typography";
import FormEx from "./features/products/add/FormEx";
import Button from "./components/ui/button";

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
    <div className="min-h-screen bg-surface-soft p-8 font-sans antialiased">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* EXISTING TYPOGRAPHY SECTIONS (Kept for your reference) */}
        <div className="border-b border-border-input pb-4">
          <Typography variant="h1" className="text-brand-primary">
            Freshly Design System 🌿
          </Typography>
        </div>
      </div>

        {/* ... (Section 1, 2, 3 remains here) ... */}

        {/* NEW SECTION: MyInput COMPONENT TESTING */}
        <div className="rounded-xl border border-border-input bg-white p-8 shadow-sm space-y-8">
          <div className="border-b border-border-input pb-4">
            <Typography variant="h2" className="text-sidebar-bg">
              Component: MyInput
            </Typography>
            <Typography variant="muted">
              Testing validation states and "Incomplete Data" handling.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Normal State */}
            {/* <MyInput label="Product Name" placeholder="e.g. Organic Bananas" /> */}

            {/* 2. Error State (Simulating Zod validation error) */}
            {/* <MyInput
              label="SKU Code"
              placeholder="FRU-BAN-001"
              error="This SKU is already assigned to another product"
            /> */}

            {/* 3. Password Type */}
            {/* <MyInput
              label="Admin Password"
              type="password"
              placeholder="••••••••"
            /> */}

            {/* 4. Missing Label Case (The "Nothing" Case) */}
            {/* 
                Since we added the guard clause 'if (!label) return null',
                the following component will NOT render anything to the screen.
            */}
            {/* <MyInput label={""} placeholder="You should not see me" /> */}
          </div>

          <div className="bg-surface-soft p-4 rounded-lg border border-dashed border-border-input">
            <Typography variant="caption" className="text-text-secondary">
              Developer Note:
            </Typography>
            <Typography variant="muted" className="text-xs">
              The fourth input in the code above is invisible because it lacks a
              label. This enforces "enough data" best practices.
            </Typography>
          </div>

          <Typography variant="muted" className="text-[10px]">
            Styles: 44px height | 7px radius | #E0E8E0 border
          </Typography>
        </div>
      </div>

      <FormEx />
    </div>
  );
}
