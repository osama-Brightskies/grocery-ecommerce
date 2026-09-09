import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/features/auth/layout/AuthLayout";
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
import ProfilePage from "@/features/users/pages/ProfilePage";
import CategoriesListPage from "@/features/categories/pages/CategoriesListPage";
import CategoryDetailPage from "@/features/categories/pages/CategoryDetailPage";
import ProductsListPage from "@/features/products/pages/ProductsListPage";
import ProductDetailsPage from "@/features/products/pages/ProductDetailsPage";
import TagListPage from "@/features/tags/pages/TagListPage";
import OrdersListPage from "@/features/orders/pages/OrdersListPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
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
      { path: "profile", element: <ProfilePage /> },
      { path: "users", element: <UsersListPage /> },
      { path: "users/:userId", element: <UserDetailPage /> },
      { path: "categories", element: <CategoriesListPage /> },
      { path: "categories/:slug", element: <CategoryDetailPage /> },
      { path: "tags", element: <TagListPage /> },
      { path: "products", element: <ProductsListPage /> },
      { path: "products/:slug", element: <ProductDetailsPage /> },
      { path: "orders", element: <OrdersListPage /> },
      { path: "orders/:guid", element: <OrderDetailPage /> },
    ],
  },

  // Dynamic Fallback Catch-All
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);
