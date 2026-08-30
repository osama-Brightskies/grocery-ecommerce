import { AUTH_TOKEN_COOKIE } from "@/api";
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";

export const publicAuthGuard = () => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);

  if (token) {
    return redirect("/dashboard");
  }
};
