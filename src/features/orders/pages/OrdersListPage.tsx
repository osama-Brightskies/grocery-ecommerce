import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Inbox } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { useGetOrders } from "../hooks/useGetOrders";
import { getOrderColumns } from "../components/order-columns"; // 👈 Pure function import
import type { Order, OrderStatus } from "../types/orders.types";
import OrdersStatusFilter from "../components/OrderStatusFilter";
import AppTable from "@/components/ui/AppTable";

export default function OrdersListPage() {
  const navigate = useNavigate();

  // 1. Page States
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

  // 4. Pure Function Call inside useMemo
  const columns = useMemo(
    () =>
      getOrderColumns({
        navigate,
        editingOrderGuid,
        onToggleEdit: (guid) =>
          setEditingOrderGuid((prev) => (prev === guid ? null : guid)),
        onStopEditing: () => setEditingOrderGuid(null),
      }),
    [navigate, editingOrderGuid],
  );

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Page Header */}
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

      {/* Filter Component */}
      <OrdersStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusFilterChange}
      />

      {/* Orders Table */}
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
