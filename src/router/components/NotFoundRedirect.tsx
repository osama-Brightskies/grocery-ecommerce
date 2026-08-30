import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE } from "@/api";

export function NotFoundRedirect() {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);
  return <Navigate to={token ? "/dashboard" : "/auth/login"} replace />;
}

export default NotFoundRedirect;