import type { AxiosError } from "axios";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** Single shape every request failure is normalized to, whatever its cause. */
export class ApiError extends Error {
  status: number | null;
  body: unknown;

  constructor(message: string, status: number | null, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export const toApiError = (
  // Added detail?: string to support .NET Web API error responses
  error: AxiosError<{ message?: string; detail?: string }>,
): ApiError => {
  // A missing response means the request never reached the server:
  // offline, DNS failure, CORS rejection or timeout. There is no status to report.
  if (!error.response) {
    return new ApiError(error.message, null);
  }

  const { status, data } = error.response;

  // `data` is absent on 204s and on error pages that are not JSON,
  // so the server message cannot be read unconditionally.
  // Checks data?.detail first (e.g. "Invalid credentials"), then data?.message
  return new ApiError(
    data?.detail ?? data?.message ?? FALLBACK_MESSAGE,
    status,
    data,
  );
};
