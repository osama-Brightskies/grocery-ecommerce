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
import CategoriesListPage from "@/features/categories/pages/CategoriesListPage";
import CategoryDetailPage from "@/features/categories/pages/CategoryDetailPage";
import NotFoundRedirect from "./components/NotFoundRedirect";
import ProductsListPage from "@/features/products/pages/ProductsListPage";
import ProductDetailsPage from "@/features/products/pages/ProductDetailsPage";
import TagListPage from "@/features/tags/pages/TagListPage";

export const router = createBrowserRouter([
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

  {
    path: "/",
    element: <AppLayout />,
    loader: protectedGuard,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "users", element: <UsersListPage /> },
      { path: "users/:userId", element: <UserDetailPage /> },
      { path: "categories", element: <CategoriesListPage /> },
      { path: "categories/:slug", element: <CategoryDetailPage /> },
      { path: "tags", element: <TagListPage /> },
      { path: "products", element: <ProductsListPage /> },
      { path: "products/:slug", element: <ProductDetailsPage /> },
    ],
  },

  // Dynamic Fallback Catch-All
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);
