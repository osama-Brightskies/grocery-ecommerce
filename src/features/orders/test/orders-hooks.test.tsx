import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../api/orders.api";
import { useGetOrderDetail } from "../hooks/useGetOrderDetail";
import { useGetOrders } from "../hooks/useGetOrders";
import { useGetUserOrders } from "../hooks/useGetUserOrders";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";

vi.mock("../api/orders.api", () => ({
  getOrdersApi: vi.fn(),
  getOrderDetailApi: vi.fn(),
  getUserOrdersApi: vi.fn(),
  updateOrderStatusApi: vi.fn(),
}));

const order = {
  guid: "order-1",
  orderNumber: "1001",
  total: 25,
  address: "Cairo",
  creationDate: "2026-09-01T10:00:00Z",
  deliveryTime: null,
  status: "Placed" as const,
};
const detailResponse = {
  success: true,
  statusCode: 200,
  message: "ok",
  data: order,
};

function makeWrapper(
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  }),
) {
  return {
    client,
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  };
}

describe("order query hooks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads order collections with their parameters", async () => {
    vi.mocked(api.getOrdersApi).mockResolvedValue({
      ...detailResponse,
      data: { data: [order] },
    });
    vi.mocked(api.getUserOrdersApi).mockResolvedValue({
      ...detailResponse,
      data: { data: [order] },
    });
    const { wrapper } = makeWrapper();
    const { result } = renderHook(
      () => ({
        orders: useGetOrders({ status: "Placed", limit: 10 }),
        userOrders: useGetUserOrders("user-1", { limit: 5 }),
      }),
      { wrapper },
    );
    await waitFor(() =>
      expect(
        result.current.orders.isSuccess && result.current.userOrders.isSuccess,
      ).toBe(true),
    );
    expect(api.getOrdersApi).toHaveBeenCalledWith({
      status: "Placed",
      limit: 10,
    });
    expect(api.getUserOrdersApi).toHaveBeenCalledWith("user-1", { limit: 5 });
  });

  it("does not load detail or user orders without identifiers", () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(
      () => ({
        detail: useGetOrderDetail(""),
        userOrders: useGetUserOrders(""),
      }),
      { wrapper },
    );
    expect(result.current.detail.fetchStatus).toBe("idle");
    expect(result.current.userOrders.fetchStatus).toBe("idle");
  });
});

describe("order mutation hook", () => {
  it("updates status and invalidates all related caches", async () => {
    vi.mocked(api.updateOrderStatusApi).mockResolvedValue(detailResponse);
    const { client, wrapper } = makeWrapper();
    const invalidate = vi
      .spyOn(client, "invalidateQueries")
      .mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useUpdateOrderStatus({ onSuccess }), {
      wrapper,
    });
    act(() =>
      result.current.mutate({ guid: "order-1", payload: { status: "Placed" } }),
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.updateOrderStatusApi).toHaveBeenCalledWith("order-1", {
      status: "Placed",
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["orders"] });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["order-detail", "order-1"],
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["user-orders"] });
    expect(onSuccess).toHaveBeenCalledWith(detailResponse);
  });
});
