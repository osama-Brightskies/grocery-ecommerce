import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "../features/dashboard/DashboardPage";
import { protectedLoader } from "./loaders/protectedLoader";
import { publicAuthLoader } from "./loaders/publicAuthLoader";
import AuthContainer from "@/features/auth/layout/AuthContainer";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // Single Auth Route: URL stays strictly as /auth
  {
    path: "/auth",
    element: <AuthContainer />,
    loader: publicAuthLoader,
  },

  // Protected Main App Route
  {
    path: "/dashboard",
    element: <DashboardPage />,
    loader: protectedLoader,
  },

  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
