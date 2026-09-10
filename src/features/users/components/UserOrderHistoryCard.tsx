import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useGetUserOrders } from "@/features/orders/hooks/useGetUserOrders";
import { formatDateTime, cn } from "@/lib/utils";
import type { OrderStatus } from "@/features/orders/types/orders.types";

export type UserOrderHistoryCardProps = {
  userGuid: string;
};

const STATUS_BADGE_CONFIG: Record<
  OrderStatus,
  { badgeClass: string; dotClass: string }
> = {
  Pending: {
    badgeClass:
      "bg-order-pending-bg text-order-pending-text border-order-pending-text/20",
    dotClass: "bg-order-pending-text",
  },
  Placed: {
    badgeClass:
      "bg-order-placed-bg text-order-placed-text border-order-placed-text/20",
    dotClass: "bg-order-placed-text",
  },
  Shipped: {
    badgeClass:
      "bg-order-shipped-bg text-order-shipped-text border-order-shipped-text/20",
    dotClass: "bg-order-shipped-text",
  },
  Delivered: {
    badgeClass:
      "bg-order-delivered-bg text-order-delivered-text border-order-delivered-text/20",
    dotClass: "bg-order-delivered-text",
  },
  Cancelled: {
    badgeClass:
      "bg-order-cancelled-bg text-status-danger-text border-status-danger-text/20",
    dotClass: "bg-status-danger-text",
  },
};

export function UserOrderHistoryCard({ userGuid }: UserOrderHistoryCardProps) {
  const navigate = useNavigate();
  const [openOrderGuid, setOpenOrderGuid] = useState<string | null>(null);

  const { data: response, isLoading } = useGetUserOrders(userGuid, {
    limit: 10,
  });

  const orders = response?.data?.data ?? [];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center text-sidebar-bg shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <Typography variant="h3" className="font-bold text-sidebar-bg">
              Order history
            </Typography>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Orders placed by this user
            </Typography>
          </div>
        </div>

        {/* View All Orders CTA */}
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate("/orders")}
          className="border-border hover:border-brand-primary text-sidebar-bg font-semibold text-xs cursor-pointer shadow-2xs"
        >
          <span>View all orders</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      {/* Orders List / Collapsibles */}
      {isLoading ? (
        <div className="py-8 text-center">
          <Typography variant="muted" className="text-sm text-text-secondary">
            Loading order history...
          </Typography>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-surface-soft text-text-secondary flex items-center justify-center mb-1">
            <Inbox className="w-5 h-5" />
          </div>
          <Typography
            variant="body"
            className="text-sm font-semibold text-sidebar-bg"
          >
            No orders found
          </Typography>
          <Typography variant="muted" className="text-xs text-text-secondary">
            This customer has not placed any orders yet.
          </Typography>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isOpen = openOrderGuid === order.guid;
            const amount = order.totalAmount ?? order.total ?? 0;
            const statusCfg =
              STATUS_BADGE_CONFIG[order.status] ?? STATUS_BADGE_CONFIG.Pending;

            return (
              <Collapsible
                key={order.guid}
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenOrderGuid(open ? order.guid : null)
                }
                className="bg-surface-soft hover:bg-surface-soft/80 border border-border/70 rounded-xl p-4 transition-all duration-200"
              >
                {/* Collapsible Trigger Row */}
                <CollapsibleTrigger asChild>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none">
                    {/* Order # & Date */}
                    <div className="space-y-0.5">
                      <Typography
                        variant="body"
                        className="font-mono font-bold text-sidebar-bg text-sm"
                      >
                        #{order.orderNumber}
                      </Typography>
                      <Typography
                        variant="muted"
                        className="text-[11px] text-text-secondary"
                      >
                        {formatDateTime(order.creationDate)}
                      </Typography>
                    </div>

                    {/* Items, Total ($), Status Pill, & Expand Arrow */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-text-secondary">
                        <Package className="w-3.5 h-3.5" />
                        <span>{order.totalItems ?? 0} items</span>
                      </div>

                      <Typography
                        variant="body"
                        className="font-bold text-sidebar-bg text-sm"
                      >
                        ${Number(amount).toFixed(2)}
                      </Typography>

                      <Badge
                        variant="outline"
                        className={cn(
                          "px-2 py-0.5 text-[11px] font-semibold border inline-flex items-center gap-1.5",
                          statusCfg.badgeClass,
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            statusCfg.dotClass,
                          )}
                        />
                        <span>{order.status}</span>
                      </Badge>

                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-text-secondary transition-transform duration-200",
                          isOpen && "rotate-180 text-brand-primary",
                        )}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Expanded Content Drawer */}
                <CollapsibleContent className="pt-3 mt-3 border-t border-border/50 text-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-text-secondary">
                    <div>
                      <span className="font-semibold text-sidebar-bg">
                        Shipping Address:{" "}
                      </span>
                      <span>{order.address || "—"}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.guid}`);
                      }}
                      className="inline-flex items-center gap-1 text-brand-primary font-bold hover:underline cursor-pointer self-start sm:self-auto"
                    >
                      <span>View order details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserOrderHistoryCard;
