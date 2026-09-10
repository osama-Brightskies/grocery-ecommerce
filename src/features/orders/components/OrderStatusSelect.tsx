import { Loader2 } from "lucide-react";
import type { OrderStatus } from "../types/orders.types";
import AppSelect, { type SelectOption } from "@/components/ui/AppSelect";

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
  const options: SelectOption[] = allowedStatuses.map((st) => ({
    label: `Mark as ${st}`,
    value: st,
  }));

  return (
    <div
      className="relative inline-flex items-center w-40"
      onClick={(e) => e.stopPropagation()}
    >
      <AppSelect
        defaultOpen={true}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isPending) {
            onCancel();
          }
        }}
        onChange={(val) => onSelectStatus(val as OrderStatus)}
        options={options}
        placeholder="Select status..."
        disabled={isPending}
        className={
          className ||
          "h-8 px-2.5 rounded-lg border-brand-primary bg-card text-xs font-semibold text-sidebar-bg"
        }
      />

      {isPending && (
        <div className="absolute right-8 pointer-events-none z-50">
          <Loader2 className="w-3.5 h-3.5 text-brand-primary animate-spin" />
        </div>
      )}
    </div>
  );
}

export default OrderStatusSelect;
