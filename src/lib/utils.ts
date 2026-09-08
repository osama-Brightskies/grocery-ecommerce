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
 * Dynamically computes cumulative store user growth leading up to today's total count
 * across the past 3 calendar months [Month-2, Month-1, Current Month].
 * Reaches the exact totalUsersCount in the current month!
 */
export function calculateLast3MonthsGrowth(
  users: { createdAt: string }[],
  totalUsersCount: number,
): { month: string; users: number; newUsers: number }[] {
  // Determine reference date: use system date, or anchor to newest database user date
  let refDate = new Date();
  if (users && users.length > 0) {
    const dates = users
      .map((u) => new Date(u.createdAt).getTime())
      .filter((t) => !isNaN(t));
    if (dates.length > 0) {
      const maxDate = new Date(Math.max(...dates));
      if (maxDate.getTime() > refDate.getTime()) {
        refDate = maxDate;
      }
    }
  }

  const months: {
    year: number;
    monthIndex: number;
    key: string;
    label: string;
    newUsers: number;
  }[] = [];

  // Generate the 3 calendar months: [2 months ago, 1 month ago, Current month]
  for (let i = 2; i >= 0; i--) {
    const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
    const year = d.getFullYear();
    const monthNum = String(d.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${monthNum}`;

    // Clean, unambiguous month name (e.g. "July", "August", "September")
    const label = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);

    months.push({
      year,
      monthIndex: d.getMonth(),
      key,
      label,
      newUsers: 0,
    });
  }

  // Count new registrations in each of the 3 months from real API timestamps
  users.forEach((u) => {
    if (!u.createdAt) return;
    const uDate = new Date(u.createdAt);
    if (isNaN(uDate.getTime())) return;

    const uKey = `${uDate.getFullYear()}-${String(uDate.getMonth() + 1).padStart(2, "0")}`;
    const target = months.find((m) => m.key === uKey);
    if (target) {
      target.newUsers += 1;
    }
  });

  // Calculate cumulative baseline so the current month ends EXACTLY at totalUsersCount!
  const currentTotal =
    totalUsersCount > 0 ? totalUsersCount : (users?.length ?? 0);
  const month2Total = currentTotal;
  const month1Total = Math.max(0, month2Total - months[2].newUsers);
  const month0Total = Math.max(0, month1Total - months[1].newUsers);

  const totals = [month0Total, month1Total, month2Total];

  return months.map((m, idx) => ({
    month: m.label,
    users: totals[idx],
    newUsers: m.newUsers,
  }));
}
