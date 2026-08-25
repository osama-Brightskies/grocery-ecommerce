import React from "react";
import { AuthLeftBanner } from "./AuthLeftBanner";

type AuthLayoutProps = {
  children: React.ReactNode;
  quote?: string;
};

export default function AuthLayout({ children, quote }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans antialiased">
      {/* Shared Left Green Banner */}
      <AuthLeftBanner quote={quote} />

      {/* Dynamic Right Side Content Container */}
      <div className="bg-surface-soft p-8 lg:p-20 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}