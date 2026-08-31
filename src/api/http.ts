import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toApiError } from "./errors";

export const AUTH_TOKEN_COOKIE = "BigCart_access_token";
export const REFRESH_TOKEN_COOKIE = "BigCart_refresh_token";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

client.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
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
