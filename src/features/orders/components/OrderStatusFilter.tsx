import { Typography } from "@/components/ui/shared/Typography";
import { STATUS_FILTER_OPTIONS } from "../constants/orders.constants";
import type { OrderStatus } from "../types/orders.types";
import AppSelect from "@/components/ui/AppSelect";

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
      <div className="flex flex-col gap-1 w-48">
        <Typography
          variant="caption"
          className="text-xs font-semibold text-text-secondary"
        >
          Filter by status
        </Typography>
        <AppSelect
          value={selectedStatus}
          onChange={(val) => onStatusChange(val as OrderStatus | "All")}
          options={STATUS_FILTER_OPTIONS}
          placeholder="Filter by status"
          className="h-10 rounded-xl bg-card border-border hover:border-brand-primary/40 text-xs font-semibold"
        />
      </div>
    </div>
  );
}

export default OrdersStatusFilter;
