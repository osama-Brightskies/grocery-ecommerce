import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, ChevronDown, Inbox } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Typography } from "@/components/ui/shared/Typography";
import { useGetOrders } from "../hooks/useGetOrders";
import { OrderStatusCell } from "../components/OrderStatusCell";
import { formatDateTime } from "@/lib/utils";
import type { Order, OrderStatus } from "../types/orders.types";
import { AppTable, type DefaultTableFeatures } from "@/components/ui/AppTable";
import OrdersStatusFilter from "../components/OrderStatusFilter";

const columnHelper = createColumnHelper<DefaultTableFeatures, Order>();

export default function OrdersListPage() {
  const navigate = useNavigate();

  // 1. Page State
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "All">(
    "All",
  );
  const [editingOrderGuid, setEditingOrderGuid] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    undefined,
  );
  const [accumulatedOrders, setAccumulatedOrders] = useState<Order[]>([]);

  // 2. Fetch Orders Query
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetOrders({
    status: selectedStatus === "All" ? undefined : selectedStatus,
    limit: 10,
    cursor: currentCursor,
  });

  const pagination = response?.data?.pagination;
  const nextCursor = pagination?.nextCursor;
  const hasNext = pagination?.hasNext ?? false;

  // 3. Accumulate Orders safely across cursor pages
  const allOrders = useMemo(() => {
    const freshData = response?.data?.data ?? [];
    if (!currentCursor) return freshData;

    const existingGuids = new Set(accumulatedOrders.map((o) => o.guid));
    const newUnique = freshData.filter((o) => !existingGuids.has(o.guid));
    return [...accumulatedOrders, ...newUnique];
  }, [response, currentCursor, accumulatedOrders]);

  const handleLoadMore = () => {
    if (nextCursor) {
      setAccumulatedOrders(allOrders);
      setCurrentCursor(nextCursor);
    }
  };

  const handleStatusFilterChange = (status: OrderStatus | "All") => {
    setSelectedStatus(status);
    setCurrentCursor(undefined);
    setAccumulatedOrders([]);
    setEditingOrderGuid(null);
  };

  // 4. TanStack Table Column Definitions (Precisely Aligned Headers & Cells)
  const columns = useMemo(
    () =>
      columnHelper.columns([
        // 1. Order #
        // Header and cell both render their own pl-6 wrapper so they line up
        // regardless of whether AppTable forwards meta.className to the <td>.
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
              [order.firstName, order.lastName]
                .filter(Boolean)
                .join(" ")
                .trim() || "Guest Customer";
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
                onStopEditing={() => setEditingOrderGuid(null)}
              />
            </div>
          ),
        }),

        // 8. Actions: Eye (View) & Pencil (Edit Status)
        // Header and cell both render their own pr-6, right-aligned wrapper
        // so the icons sit directly under the "ACTIONS" label.
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
                {!isTerminal && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingOrderGuid((prev) =>
                        prev === order.guid ? null : order.guid,
                      )
                    }
                    className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-mint transition-colors cursor-pointer"
                    title="Change order status"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}

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
      ]),
    [navigate, editingOrderGuid],
  );

  return (
    <div className="space-y-6 w-full pb-16">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <Typography
          variant="h1"
          className="text-2xl md:text-3xl font-bold text-sidebar-bg"
        >
          Orders
        </Typography>
        <Typography variant="muted" className="text-sm text-text-secondary">
          Track and manage customer orders
        </Typography>
      </div>

      {/* 2. Status Filter Control */}
      <OrdersStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusFilterChange}
      />

      {/* 3. Table / State Displays */}
      {isLoading && !currentCursor ? (
        <div className="w-full bg-card rounded-2xl border border-border p-12 text-center shadow-xs">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <Typography variant="muted" className="text-text-secondary text-sm">
              Loading orders...
            </Typography>
          </div>
        </div>
      ) : allOrders.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center max-w-md mx-auto my-12 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-surface-mint text-brand-primary flex items-center justify-center mx-auto mb-2">
            <Inbox className="w-6 h-6" />
          </div>
          <Typography
            variant="h3"
            className="text-base font-bold text-sidebar-bg"
          >
            No orders found
          </Typography>
          <Typography variant="muted" className="text-xs text-text-secondary">
            {selectedStatus !== "All"
              ? `There are no orders with status "${selectedStatus}".`
              : "There are currently no customer orders in the system."}
          </Typography>
        </div>
      ) : (
        <AppTable
          data={allOrders}
          columns={columns}
          isLoading={isLoading}
          paginationBar={
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border select-none">
              <Typography
                variant="muted"
                className="text-xs text-text-secondary"
              >
                Showing {allOrders.length} orders
              </Typography>

              {hasNext && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border bg-card text-xs font-semibold text-sidebar-bg hover:bg-surface-soft hover:border-brand-primary/40 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <span>{isFetching ? "Loading..." : "Load more orders"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                </button>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
