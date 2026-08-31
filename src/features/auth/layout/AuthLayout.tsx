import { Outlet, useLocation } from "react-router-dom";
import { AuthLeftBanner } from "./AuthLeftBanner";

export default function AuthLayout() {
  const location = useLocation();

  // Dynamic left quote matching Figma based on active URL route
  const isForgotStep = location.pathname.includes("forgot-password");
  const leftQuote = isForgotStep
    ? "“Fresh products. Clear operations.”"
    : "“Keep your shelves fresh and your data even fresher.”";

  return (
    <div
      data-testid="auth-layout"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans antialiased"
    >
      {/* Shared Left Green Banner */}
      <AuthLeftBanner quote={leftQuote} />

      {/* Dynamic Right Side Content (Renders whichever auth sub-route is active) */}
      <div
        data-testid="auth-content"
        className="bg-surface-soft p-8 lg:p-20 flex items-center justify-center"
      >
        <Outlet />
      </div>
    </div>
  );
}
