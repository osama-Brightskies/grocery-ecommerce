import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_S3_BASE =
  "https://ecommerce-interns-bucket.s3.eu-central-1.amazonaws.com/";

/**
 * Resolves a relative image path to its full S3 URL.
 * Busses browser disk cache using the backend's official updatedAt timestamp.
 */
export function getImageUrl(path?: string, updatedAt?: string): string {
  if (!path || path.trim() === "") return "/placeholder-image.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const s3Base = import.meta.env.VITE_S3_BASE_URL || DEFAULT_S3_BASE;

  const cleanBase = s3Base.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  const baseFullUrl = `${cleanBase}/${cleanPath}`;

  // If the server provided a real updatedAt timestamp (not default 0001-01-01), use it to bust cache
  if (updatedAt && updatedAt !== "0001-01-01T00:00:00") {
    const time = new Date(updatedAt).getTime();
    if (!isNaN(time) && time > 0) {
      return `${baseFullUrl}?v=${time}`;
    }
  }

  return baseFullUrl;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getInitials(
  firstName?: string,
  lastName?: string,
  email?: string,
): string {
  if (firstName && lastName)
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}
