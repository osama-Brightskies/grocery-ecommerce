import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ForgotPasswordPage from "../features/auth/forgot-password/ForgotPasswordPage";
import AuthLayout from "../features/auth/layout/AuthLayout";
import LoginPage from "../features/auth/login/LoginPage";
import ResetPasswordPage from "../features/auth/reset-password/ResetPasswordPage";
import VerifyOtpPage from "../features/auth/verify-otp/VerifyOtpPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import { protectedGuard } from "./guards/protectedGuard";
import { publicAuthGuard } from "./guards/publicAuthGuard";

export const router = createBrowserRouter([
  // 1. PUBLIC AUTH ROUTES (Wrapped in AuthLayout)
  {
    path: "/auth",
    element: <AuthLayout />,
    loader: publicAuthGuard,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "verify-otp", element: <VerifyOtpPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // 2. PROTECTED APP ROUTES (Wrapped in AppLayout with Sidebar)
  {
    path: "/",
    element: <AppLayout />,
    loader: protectedGuard,
    children: [
      // Default page when visiting / (Dashboard renders by default)
      { index: true, element: <DashboardPage /> },

      // Alias route for /dashboard
      { path: "dashboard", element: <DashboardPage /> },

      // Clean top-level sibling routes for teammates:
      // { path: "products", element: <ProductsPage /> },  <-- URL: /products
      // { path: "users", element: <UsersPage /> },        <-- URL: /users
    ],
  },

  // Fallback Catch-All
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
