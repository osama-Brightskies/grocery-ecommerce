import { useState } from "react";
import { ShoppingBag, Copy, Check } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { formatDateTime, cn } from "@/lib/utils";
import type { Order, OrderStatus } from "../types/orders.types";
import { toast } from "sonner";

export type OrderInformationCardProps = {
  order: Order;
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeClasses: string; dotClass: string }
> = {
  Pending: {
    label: "Pending",
    badgeClasses:
      "bg-order-pending-bg text-order-pending-text border-order-pending-text/20",
    dotClass: "bg-order-pending-text",
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

export function OrderInformationCard({ order }: OrderInformationCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Pending;
  const amount = order.totalAmount ?? order.total ?? 0;

  // 🔑 Calculated fallback: sums quantities from order.items when order.totalItems is not returned
  const computedTotalItems =
    order.totalItems ??
    (Array.isArray(order.items)
      ? order.items.reduce(
          (sum: number, item) => sum + (Number(item?.quantity) || 1),
          0,
        )
      : 0);

  // 🔑 Guard against uninitialized "0001-01-01" default timestamps
  const isValidDeliveryTime =
    order.deliveryTime && !order.deliveryTime.startsWith("0001-01-01");

  const handleCopyGuid = () => {
    navigator.clipboard.writeText(order.guid);
    setIsCopied(true);
    toast.success("Order GUID copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center text-sidebar-bg shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <Typography variant="h3" className="font-semibold text-sidebar-bg">
            Order information
          </Typography>
          <Typography variant="muted" className="text-xs text-text-secondary">
            Key details about this customer order
          </Typography>
        </div>
      </div>

      {/* Details Grid (4-Column Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 text-sm">
        {/* Row 1 */}
        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Order number
          </Typography>
          <Typography
            variant="body"
            className="font-bold text-sidebar-bg font-mono"
          >
            #{order.orderNumber}
          </Typography>
        </div>

        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Total amount
          </Typography>
          <Typography variant="body" className="font-bold text-sidebar-bg">
            ${Number(amount).toFixed(2)}
          </Typography>
        </div>

        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Delivery address
          </Typography>
          <Typography
            variant="body"
            className="font-medium text-sidebar-bg truncate max-w-xs"
            title={order.address}
          >
            {order.address || "—"}
          </Typography>
        </div>

        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Created at
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {formatDateTime(order.creationDate)}
          </Typography>
        </div>

        {/* Row 2 */}
        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Order GUID
          </Typography>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopyGuid}
                className="flex items-center gap-1.5 cursor-pointer group text-left"
              >
                <Typography
                  variant="body"
                  className="font-mono text-xs text-text-secondary group-hover:text-sidebar-bg transition-colors truncate max-w-37.5"
                >
                  {order.guid.slice(0, 8)}...{order.guid.slice(-6)}
                </Typography>
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-text-secondary group-hover:text-sidebar-bg transition-colors shrink-0" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="font-mono text-surface-mint">{order.guid}</span>
              <span className="text-[10px] text-text-secondary border-l border-white/20 pl-1.5 ml-1.5">
                Click to copy
              </span>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Total items */}
        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Total items
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {computedTotalItems} {computedTotalItems === 1 ? "item" : "items"}
          </Typography>
        </div>

        {/* Delivery time */}
        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Delivery time
          </Typography>
          <Typography variant="body" className="font-medium text-sidebar-bg">
            {isValidDeliveryTime
              ? formatDateTime(order.deliveryTime!)
              : "Not scheduled yet"}
          </Typography>
        </div>

        <div className="space-y-1">
          <Typography variant="muted" className="text-xs text-text-secondary">
            Current status
          </Typography>
          <div>
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 text-xs font-semibold border inline-flex items-center gap-1.5 select-none",
                statusCfg.badgeClasses,
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  statusCfg.dotClass,
                )}
              />
              <span>{statusCfg.label}</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderInformationCard;
