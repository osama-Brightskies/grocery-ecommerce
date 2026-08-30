import AuthLayout from "@/features/auth/layout/AuthLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { publicAuthGuard } from "./guards/publicAuthGuard";
import LoginPage from "@/features/auth/login/LoginPage";
import ForgotPasswordPage from "@/features/auth/forgot-password/ForgotPasswordPage";
import VerifyOtpPage from "@/features/auth/verify-otp/VerifyOtpPage";
import ResetPasswordPage from "@/features/auth/reset-password/ResetPasswordPage";
import AppLayout from "@/components/layout/AppLayout";
import { protectedGuard } from "./guards/protectedGuard";
import DashboardPage from "@/features/dashboard/DashboardPage";
import UsersListPage from "@/features/users/pages/UsersListPage";
import UserDetailPage from "@/features/users/pages/UserDetailPage";
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
      { path: "users", element: <UsersListPage /> },
      { path: "users/:userId", element: <UserDetailPage /> },
    ],
  },

  // Dynamic Fallback Catch-All
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);
