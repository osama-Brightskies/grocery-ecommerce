import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: "In stock" | "Low stock" | "Out of stock" | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getBadgeStyle = (val: string) => {
    switch (val.toLowerCase()) {
      case "in stock":
        return "bg-[#EBF7EE] text-[#1B803A]";
      case "low stock":
        return "bg-[#FFF4E5] text-[#D97706]";
      case "out of stock":
        return "bg-[#FEECEC] text-[#DC2626]";
      default:
        return "bg-surface-soft text-text-subtle";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold select-none",
        getBadgeStyle(status),
        className
      )}
    >
      {status}
    </span>
  );
}

export default StatusBadge;