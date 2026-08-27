import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import { AUTH_TOKEN_COOKIE } from "../../api";

export const publicAuthGuard = () => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);

  // If already logged in, redirect away from auth pages to dashboard
  if (token) {
    return redirect("/dashboard");
  }

  return null;
};
