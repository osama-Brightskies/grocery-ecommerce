import { Typography } from "@/components/ui/shared/Typography";
import { STATUS_FILTER_OPTIONS } from "../constants/orders.constants";
import type { OrderStatus } from "../types/orders.types";

export type OrdersStatusFilterProps = {
  selectedStatus: OrderStatus | "All";
  onStatusChange: (status: OrderStatus | "All") => void;
};

export function OrdersStatusFilter({
  selectedStatus,
  onStatusChange,
}: OrdersStatusFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-1">
        <Typography
          variant="caption"
          className="text-xs font-semibold text-text-secondary"
        >
          Filter by status
        </Typography>
        <select
          value={selectedStatus}
          onChange={(e) =>
            onStatusChange(e.target.value as OrderStatus | "All")
          }
          className="h-10 px-3.5 pr-8 rounded-xl border border-border bg-card text-xs font-semibold text-sidebar-bg focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-xs cursor-pointer hover:border-border-input transition-colors"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default OrdersStatusFilter;
