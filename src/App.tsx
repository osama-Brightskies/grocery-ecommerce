import { Typography } from "./components/common/Typography";
import { Button } from "./components/UI/Button";

export default function App() {
  return (
    <div className="min-h-screen bg-surface-soft p-8 font-sans antialiased">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="border-b border-border-input pb-4">
          <Typography variant="h1" className="text-brand-primary">
            Freshly Typography & Color Combinations 🌿
          </Typography>
          <Typography variant="muted" className="mt-1">
            Testing all variants and verifying that passing custom `className`
            overrides default styles.
            <div className="p-6 bg-white rounded-xl border border-border-input flex items-center gap-3">
              <Button variant="danger" size="figma_green">
                Save changes
              </Button>
              <Button variant="primary" size="figma_white">
                Outline
              </Button>
              <Button variant="outline" size="default">
                TestTestTestTestTestTest
              </Button>
            </div>
          </Typography>
        </div>

        {/* SECTION 1: Standard Variants (Default Colors) */}
        <div className="rounded-xl border border-border-input bg-white p-6 shadow-sm space-y-4">
          <Typography
            variant="h3"
            className="text-brand-primary border-b border-border-input pb-2"
          >
            1. Standard Variants (Default Dark Text)
          </Typography>

          <div className="space-y-3">
            <Typography variant="h1">H1 Title (Default Dark)</Typography>
            <Typography variant="h2">H2 Subheading (Default Dark)</Typography>
            <Typography variant="h3">H3 Card Header (Default Dark)</Typography>
            <Typography variant="body">
              Body paragraph text (Default Dark)
            </Typography>
            <Typography variant="muted">
              Muted subtext (Default Gray)
            </Typography>
            <div>
              <Typography variant="label">
                Form Field Label (Default Dark)
              </Typography>
            </div>
            <div>
              <Typography variant="caption">TABLE CAPTION HEADER</Typography>
            </div>
          </div>
        </div>

        {/* SECTION 2: Proof that className Overrides Variant Styles */}
        <div className="rounded-xl border border-border-input bg-white p-6 shadow-sm space-y-4">
          <Typography
            variant="h3"
            className="text-brand-primary border-b border-border-input pb-2"
          >
            2. Override Proof (className passed from parent wins!)
          </Typography>

          <div className="space-y-3">
            {/* Overridden to Brand Primary Green */}
            <Typography variant="h1" className="text-brand-primary">
              H1 Variant + Overridden to Green (text-brand-primary)
            </Typography>

            {/* Overridden to Warning Orange */}
            <Typography variant="h2" className="text-status-warning-text">
              H2 Variant + Overridden to Orange (text-status-warning-text)
            </Typography>

            {/* Overridden to Danger Red */}
            <Typography variant="h3" className="text-status-danger-text">
              H3 Variant + Overridden to Red (text-status-danger-text)
            </Typography>

            {/* Overridden to Accent Green */}
            <Typography variant="body" className="text-brand-accent font-bold">
              Body Variant + Overridden to Bright Green & Bold
            </Typography>
          </div>
        </div>

        {/* SECTION 3: All Theme Color Combinations */}
        <div className="rounded-xl border border-border-input bg-white p-6 shadow-sm space-y-4">
          <Typography
            variant="h3"
            className="text-brand-primary border-b border-border-input pb-2"
          >
            3. All Theme Color Combinations
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Green */}
            <div className="p-4 rounded-lg bg-surface-soft border border-border-input">
              <Typography variant="caption">PRIMARY GREEN</Typography>
              <Typography variant="h2" className="text-brand-primary mt-1">
                #1F7D47
              </Typography>
            </div>

            {/* Bright Accent Green */}
            <div className="p-4 rounded-lg bg-surface-soft border border-border-input">
              <Typography variant="caption">BRIGHT ACCENT GREEN</Typography>
              <Typography variant="h2" className="text-brand-accent mt-1">
                #34A853
              </Typography>
            </div>

            {/* Warning Status Card */}
            <div className="p-4 rounded-lg bg-status-warning-bg border border-status-warning-text/20">
              <Typography
                variant="caption"
                className="text-status-warning-text"
              >
                WARNING STATUS
              </Typography>
              <Typography
                variant="body"
                className="text-status-warning-text font-bold mt-1"
              >
                Low Stock (18 items left)
              </Typography>
            </div>

            {/* Danger Status Card */}
            <div className="p-4 rounded-lg bg-status-danger-bg border border-status-danger-text/20">
              <Typography variant="caption" className="text-status-danger-text">
                DANGER STATUS
              </Typography>
              <Typography
                variant="body"
                className="text-status-danger-text font-bold mt-1"
              >
                Out of Stock (0 items left)
              </Typography>
            </div>

            {/* Dark Sidebar Container */}
            <div className="p-5 rounded-lg bg-sidebar-bg sm:col-span-2 space-y-2">
              <Typography variant="caption" className="text-text-subtle">
                DARK SIDEBAR CONTAINER (#1A241F)
              </Typography>
              <Typography variant="h2" className="text-white">
                White Text on Dark Background
              </Typography>
              <Typography variant="muted" className="text-text-subtle">
                Subtle gray-green text (#BDC7BF)
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
