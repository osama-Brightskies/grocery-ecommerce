import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import { AUTH_TOKEN_COOKIE } from "../../api";
import { useAuthStore } from "../../store/useAuthStore";

export const protectedGuard = () => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);
  const user = useAuthStore.getState().user;

  if (!token || (user && user.role !== 1)) {
    return redirect("/auth/login");
  }

  return null;
};
