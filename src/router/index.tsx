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
import NotFoundRedirect from "./components/NotFoundRedirect";

export const router = createBrowserRouter([
  // 1. PUBLIC AUTH ROUTES
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

  // 2. PROTECTED APP ROUTES
  {
    path: "/",
    element: <AppLayout />,
    loader: protectedGuard,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
    ],
  },

  // Dynamic Fallback Catch-All
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);
