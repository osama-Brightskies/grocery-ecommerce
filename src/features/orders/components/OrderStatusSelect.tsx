import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../types/orders.types";

export type OrderStatusSelectProps = {
  currentStatus: OrderStatus;
  allowedStatuses: OrderStatus[];
  onSelectStatus: (nextStatus: OrderStatus) => void;
  onCancel: () => void;
  isPending?: boolean;
  className?: string;
};

export function OrderStatusSelect({
  allowedStatuses,
  onSelectStatus,
  onCancel,
  isPending = false,
  className,
}: OrderStatusSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as OrderStatus;
    if (nextStatus) {
      onSelectStatus(nextStatus);
    } else {
      onCancel();
    }
  };

  return (
    <div
      className={cn("relative inline-flex items-center gap-1.5", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <select
        autoFocus
        defaultValue=""
        disabled={isPending}
        onChange={handleChange}
        onBlur={onCancel}
        className={cn(
          "h-8 px-2.5 pr-7 rounded-lg border border-brand-primary bg-card text-xs font-semibold text-sidebar-bg",
          "focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-xs cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed transition-all",
        )}
      >
        <option value="" disabled>
          Select status...
        </option>
        {allowedStatuses.map((status) => (
          <option key={status} value={status}>
            Mark as {status}
          </option>
        ))}
      </select>

      {/* Loading Spinner during status change */}
      {isPending && (
        <div className="absolute right-2 pointer-events-none">
          <Loader2 className="w-3.5 h-3.5 text-brand-primary animate-spin" />
        </div>
      )}
    </div>
  );
}

export default OrderStatusSelect;
