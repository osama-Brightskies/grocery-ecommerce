import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  PackageCheck,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetOrderDetail } from "../hooks/useGetOrderDetail";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { OrderInformationCard } from "../components/OrderInformationCard";
import { OrderStatusStepper } from "../components/OrderStatusStepper";
import { OrderNotFoundState } from "../components/OrderNotFoundState";
import type { OrderStatus } from "../types/orders.types";
import { cn } from "@/lib/utils";

// Status Badge Config
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

export default function OrderDetailPage() {
  const { guid = "" } = useParams<{ guid: string }>();
  const navigate = useNavigate();

  // 1. Fetch Single Order Query
  const { data: response, isLoading, isError } = useGetOrderDetail(guid);
  const order = response?.data;

  // 2. Status Mutation Hook
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus({
    onSuccess: (res) => {
      toast.success(`Order status changed to ${res.data.status}.`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update order status");
    },
  });

  // 3. Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <Typography variant="muted">Loading order details...</Typography>
        </div>
      </div>
    );
  }

  // 4. In-Page 404 Not Found State
  if (isError || !order) {
    return <OrderNotFoundState guid={guid} />;
  }

  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Pending;

  // Determine Sequential Next Status & Allowed Actions
  const getNextAction = () => {
    switch (order.status) {
      case "Pending":
        return {
          label: "Mark as placed",
          nextStatus: "Placed" as OrderStatus,
          icon: <CheckCircle2 className="w-4 h-4 mr-1.5" />,
        };
      case "Placed":
        return {
          label: "Mark as shipped",
          nextStatus: "Shipped" as OrderStatus,
          icon: <Truck className="w-4 h-4 mr-1.5" />,
        };
      case "Shipped":
        return {
          label: "Mark as delivered",
          nextStatus: "Delivered" as OrderStatus,
          icon: <PackageCheck className="w-4 h-4 mr-1.5" />,
        };
      default:
        return null; // Delivered or Cancelled orders cannot be advanced
    }
  };

  const nextAction = getNextAction();
  // Cancel is allowed only before shipping (during Placed)
  const canCancel = order.status === "Placed";

  return (
    <div className="space-y-8 w-full pb-16">
      {/* 1. Back Navigation Button */}
      <button
        type="button"
        onClick={() => navigate("/orders")}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <Typography variant="body" className="font-medium text-inherit">
          Back to Orders
        </Typography>
      </button>

      {/* 2. Header Bar: Title + Status Badge + Dynamic Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Typography
              variant="h1"
              className="text-2xl md:text-3xl font-bold text-sidebar-bg font-mono"
            >
              Order #{order.orderNumber}
            </Typography>

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

          <Typography
            variant="muted"
            className="text-xs font-mono text-text-secondary"
          >
            {order.guid}
          </Typography>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sequential Advance Button */}
          {nextAction && (
            <Button
              variant="primary"
              size="default"
              disabled={isPending}
              onClick={() =>
                updateStatus({
                  guid: order.guid,
                  payload: { status: nextAction.nextStatus },
                })
              }
              className="font-semibold shadow-xs cursor-pointer"
            >
              {nextAction.icon}
              <Typography variant="body" className="font-semibold text-white">
                {isPending ? "Updating..." : nextAction.label}
              </Typography>
            </Button>
          )}

          {/* Cancel Order Button (Strictly visible only during Pending & Placed) */}
          {canCancel && (
            <Button
              variant="danger"
              size="default"
              disabled={isPending}
              onClick={() =>
                updateStatus({
                  guid: order.guid,
                  payload: { status: "Cancelled" },
                })
              }
              className="font-semibold cursor-pointer shadow-xs"
            >
              <Ban className="w-4 h-4 mr-1.5" />
              <span>Cancel order</span>
            </Button>
          )}
        </div>
      </div>

      {/* 3. Section 1: Order Information Card */}
      <OrderInformationCard order={order} />

      {/* 4. Section 2: Animated Order Status Stepper Card */}
      <OrderStatusStepper
        status={order.status}
        creationDate={order.creationDate}
      />
    </div>
  );
}
