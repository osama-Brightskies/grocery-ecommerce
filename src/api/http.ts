import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { executeSilentRefresh } from "../features/auth/api/refresh.api";
import { AUTH_TOKEN_COOKIE } from "./auth.constants";
import { toApiError } from "./errors";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

// Request Interceptor: Attach Access Token to every outgoing request
client.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor: Catches 401s, silently refreshes token, and retries request
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 occurs and has not been retried yet (avoid login/refresh loops)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/login") &&
      !originalRequest.url?.includes("/api/auth/refresh")
    ) {
      originalRequest._retry = true;

      // Execute shared silent refresh
      const refreshSuccess = await executeSilentRefresh();

      if (refreshSuccess) {
        // Retry failed request with new access token
        const newToken = Cookies.get(AUTH_TOKEN_COOKIE);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return client(originalRequest);
      }

      return Promise.reject(toApiError(error));
    }

    return Promise.reject(toApiError(error));
  },
);

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<T>(url, config).then((response) => response.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.post<T>(url, body, config).then((response) => response.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.put<T>(url, body, config).then((response) => response.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.patch<T>(url, body, config).then((response) => response.data),

  delete: <T = void>(url: string, config?: AxiosRequestConfig) =>
    client.delete<T>(url, config).then((response) => response.data),
};
