import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_S3_BASE =
  "https://ecommerce-interns-bucket.s3.eu-central-1.amazonaws.com/";

export function getImageUrl(path?: string, updatedAt?: string): string {
  if (!path || path.trim() === "") return "/placeholder-image.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const s3Base = import.meta.env.VITE_S3_BASE_URL || DEFAULT_S3_BASE;

  const cleanBase = s3Base.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  const baseFullUrl = `${cleanBase}/${cleanPath}`;

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

/**
 * 🪄 Pure Data Function: Extracts months from real `createdAt` timestamps,
 * sorts chronologically, and calculates real cumulative user registrations.
 */
export function calculateUserGrowth(
  users: { createdAt: string }[],
): { month: string; users: number }[] {
  if (!users || users.length === 0) return [];

  const monthMap = new Map<string, { label: string; count: number }>();

  users.forEach((u) => {
    if (!u.createdAt) return;
    const date = new Date(u.createdAt);
    if (isNaN(date.getTime())) return;

    // e.g. "2026-08" for sorting
    const year = date.getFullYear();
    const monthNum = String(date.getMonth() + 1).padStart(2, "0");
    const sortKey = `${year}-${monthNum}`;

    // e.g. "Aug '26" or "Jan '24"
    const label = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "2-digit",
    }).format(date);

    const existing = monthMap.get(sortKey);
    if (existing) {
      existing.count += 1;
    } else {
      monthMap.set(sortKey, { label, count: 1 });
    }
  });

  // Sort chronologically
  const sortedEntries = Array.from(monthMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  // Compute cumulative growth curve from real records
  let cumulative = 0;
  return sortedEntries.map(([, val]) => {
    cumulative += val.count;
    return {
      month: val.label,
      users: cumulative,
    };
  });
}
