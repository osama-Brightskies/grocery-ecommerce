import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import type { Order, OrderStatus } from "../types/orders.types";
import { cn } from "@/lib/utils";

export type OrderStatusCellProps = {
  order: Order;
  isEditing: boolean;
  onStopEditing: () => void;
};

// 🪄 Strict Rule: Cancel is ONLY allowed when status is "Placed"
const GET_ALLOWED_NEXT_STATUSES = (current: OrderStatus): OrderStatus[] => {
  switch (current) {
    case "Pending":
      return ["Placed"]; // No cancel while pending
    case "Placed":
      return ["Shipped", "Cancelled"]; // Cancel allowed here
    case "Shipped":
      return ["Delivered"];
    default:
      return [];
  }
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeClasses: string; dotClass: string }
> = {
  Pending: {
    label: "Pending",
    badgeClasses: "bg-[#FEF3C7] text-[#B45309] border-[#B45309]/20", // Sophisticated soft amber
    dotClass: "bg-[#B45309]",
  },
  Placed: {
    label: "Placed",
    badgeClasses:
      "bg-order-placed-bg text-order-placed-text border-order-placed-text/20",
    dotClass: "bg-order-placed-text",
  },
  Shipped: {
    label: "Shipped",
    badgeClasses:
      "bg-order-shipped-bg text-order-shipped-text border-order-shipped-text/20",
    dotClass: "bg-order-shipped-text",
  },
  Delivered: {
    label: "Delivered",
    badgeClasses:
      "bg-order-delivered-bg text-order-delivered-text border-order-delivered-text/20",
    dotClass: "bg-order-delivered-text",
  },
  Cancelled: {
    label: "Cancelled",
    badgeClasses:
      "bg-order-cancelled-bg text-status-danger-text border-status-danger-text/20",
    dotClass: "bg-status-danger-text",
  },
};

export function OrderStatusCell({
  order,
  isEditing,
  onStopEditing,
}: OrderStatusCellProps) {
  const allowedNextStatuses = GET_ALLOWED_NEXT_STATUSES(order.status);

  const { mutate: updateStatus, isPending } = useUpdateOrderStatus({
    onSuccess: (res) => {
      toast.success(`Order status updated to ${res.data.status}.`);
      onStopEditing();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update order status");
      onStopEditing();
    },
  });

  const handleSelectStatus = (nextStatus: OrderStatus) => {
    updateStatus({
      guid: order.guid,
      payload: { status: nextStatus },
    });
  };

  if (isEditing && allowedNextStatuses.length > 0) {
    return (
      <OrderStatusSelect
        currentStatus={order.status}
        allowedStatuses={allowedNextStatuses}
        onSelectStatus={handleSelectStatus}
        onCancel={onStopEditing}
        isPending={isPending}
      />
    );
  }

  const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Pending;

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 text-xs font-semibold border inline-flex items-center gap-1.5 select-none",
        config.badgeClasses,
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass)}
      />
      <span>{config.label}</span>
    </Badge>
  );
}

export default OrderStatusCell;
