import { Typography } from "./components/Typography";
import ProductFormEx from "./features/products/add/ProductFormEx";
import AddAdminForm from "./features/auth/Admin/add/AddAdminForm";

export default function App() {
  return (
    <div className="min-h-screen bg-surface-soft p-8 font-sans antialiased">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* DESIGN SYSTEM HEADER */}
        <div className="border-b border-border-input pb-4">
          <Typography variant="h1" className="text-brand-primary">
            Freshly Design System & Form Playground 🌿
          </Typography>
        </div>

        {/* SIDE-BY-SIDE FORMS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: PRODUCT FORM */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-border-input">
              <Typography
                variant="h3"
                className="text-sidebar-bg font-semibold"
              >
                Test 1: Create Product Form
              </Typography>
              <Typography variant="muted" className="text-xs">
                Testing inputs, selects, textarea, and numeric coercion.
              </Typography>
            </div>
            <ProductFormEx />
          </div>

          {/* RIGHT COLUMN: ADMIN REGISTRATION FORM */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-border-input">
              <Typography
                variant="h3"
                className="text-sidebar-bg font-semibold"
              >
                Test 2: Add Admin Form
              </Typography>
              <Typography variant="muted" className="text-xs">
                Testing text, email, and password match refinement.
              </Typography>
            </div>
            <AddAdminForm />
          </div>
        </div>
      </div>
    </div>
  );
}
