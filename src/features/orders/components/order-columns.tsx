import { Eye, Pencil } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Typography } from "@/components/ui/shared/Typography";
import { OrderStatusCell } from "./OrderStatusCell";
import { formatDateTime } from "@/lib/utils";
import type { Order } from "../types/orders.types";
import type { DefaultTableFeatures } from "@/components/ui/AppTable";

const columnHelper = createColumnHelper<DefaultTableFeatures, Order>();

export type GetOrderColumnsOptions = {
  navigate: (path: string) => void;
  editingOrderGuid: string | null;
  onToggleEdit: (guid: string) => void;
  onStopEditing: () => void;
};

/**
 * Pure function that generates TanStack Table column definitions for Orders.
 * (Not a hook — zero internal state, pure declarative output).
 */
export function getOrderColumns({
  navigate,
  editingOrderGuid,
  onToggleEdit,
  onStopEditing,
}: GetOrderColumnsOptions) {
  return columnHelper.columns([
    // 1. Order #
    columnHelper.accessor("orderNumber", {
      header: () => <div className="text-left pl-6">ORDER #</div>,
      meta: { className: "text-left" },
      cell: ({ row }) => (
        <div className="pl-6">
          <Typography
            variant="body"
            className="font-bold text-sidebar-bg font-mono text-xs text-left"
          >
            #{row.original.orderNumber}
          </Typography>
        </div>
      ),
    }),

    // 2. Customer Name
    columnHelper.accessor("firstName", {
      id: "customer",
      header: () => <div className="text-left">CUSTOMER</div>,
      meta: { className: "text-left" },
      cell: ({ row }) => {
        const order = row.original;
        const fullName =
          [order.firstName, order.lastName].filter(Boolean).join(" ").trim() ||
          "Guest Customer";
        return (
          <Typography
            variant="body"
            className="font-semibold text-sidebar-bg text-xs text-left"
          >
            {fullName}
          </Typography>
        );
      },
    }),

    // 3. Created (Date & Time)
    columnHelper.accessor("creationDate", {
      header: "CREATED",
      meta: { className: "text-center" },
      cell: (info) => (
        <Typography
          variant="body"
          className="text-text-secondary text-xs text-center"
        >
          {formatDateTime(info.getValue())}
        </Typography>
      ),
    }),

    // 4. Items Count
    columnHelper.accessor("totalItems", {
      header: "ITEMS",
      meta: { className: "text-center" },
      cell: (info) => {
        const count = info.getValue() ?? 0;
        return (
          <Typography
            variant="body"
            className="text-sidebar-bg text-xs font-medium text-center"
          >
            {count} {count === 1 ? "item" : "items"}
          </Typography>
        );
      },
    }),

    // 5. Total Amount ($)
    columnHelper.accessor("total", {
      header: "TOTAL",
      meta: { className: "text-center" },
      cell: ({ row }) => {
        const amount = row.original.total ?? row.original.totalAmount ?? 0;
        return (
          <Typography
            variant="body"
            className="font-bold text-sidebar-bg text-xs text-center"
          >
            ${Number(amount).toFixed(2)}
          </Typography>
        );
      },
    }),

    // 6. Customer Shipping Address
    columnHelper.accessor("address", {
      header: () => <div className="text-left">ADDRESS</div>,
      meta: { className: "text-left" },
      cell: (info) => (
        <Typography
          variant="body"
          className="text-text-secondary text-xs truncate max-w-xs text-left"
          title={info.getValue()}
        >
          {info.getValue() || "—"}
        </Typography>
      ),
    }),

    // 7. Status (Badge or Inline Status Select)
    columnHelper.accessor("status", {
      header: "STATUS",
      meta: { className: "text-center" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <OrderStatusCell
            order={row.original}
            isEditing={editingOrderGuid === row.original.guid}
            onStopEditing={onStopEditing}
          />
        </div>
      ),
    }),

    // 8. Actions (View & Inline Status Edit)
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right pr-6">ACTIONS</div>,
      meta: { className: "text-right" },
      cell: ({ row }) => {
        const order = row.original;
        const isTerminal =
          order.status === "Delivered" || order.status === "Cancelled";

        return (
          <div className="flex items-center justify-end gap-1.5 pr-6">
            {/* Edit Status Pencil Button (Hidden for terminal statuses) */}
            {!isTerminal && (
              <button
                type="button"
                onClick={() => onToggleEdit(order.guid)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-mint transition-colors cursor-pointer"
                title="Change order status"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}

            {/* View Details Eye Button */}
            <button
              type="button"
              onClick={() => navigate(`/orders/${order.guid}`)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-mint transition-colors cursor-pointer"
              title="View order details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ]);
}
