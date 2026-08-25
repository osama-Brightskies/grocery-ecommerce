import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import { AUTH_TOKEN_COOKIE } from "../../api";

export const protectedLoader = () => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);

  if (!token) {
    return redirect("/auth/login");
  }

  return null;
};
