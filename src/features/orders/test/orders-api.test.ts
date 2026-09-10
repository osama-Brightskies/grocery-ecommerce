import { afterEach, describe, expect, it, vi } from "vitest";
import { http } from "@/api";
import {
  getOrderDetailApi,
  getOrdersApi,
  getUserOrdersApi,
  updateOrderStatusApi,
} from "../api/orders.api";

describe("orders API contracts", () => {
  afterEach(() => vi.restoreAllMocks());

  it("maps list filters and cursor pagination to API casing", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);
    await getOrdersApi({ status: "Placed", limit: 10, cursor: "next" });
    expect(http.get).toHaveBeenCalledWith("/api/orders", {
      params: { Status: "Placed", Limit: 10, Cursor: "next" },
    });
  });

  it("gets order and user-order details", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);
    await getOrderDetailApi("order-1");
    await getUserOrdersApi("user-1", { limit: 5, cursor: "two" });
    expect(http.get).toHaveBeenNthCalledWith(1, "/api/orders/order-1");
    expect(http.get).toHaveBeenNthCalledWith(2, "/api/orders/user/user-1", {
      params: { Limit: 5, Cursor: "two" },
    });
  });

  it("updates an order status", async () => {
    vi.spyOn(http, "put").mockResolvedValue(undefined);
    await updateOrderStatusApi("order-1", { status: "Shipped" });
    expect(http.put).toHaveBeenCalledWith("/api/orders/order-1/status", {
      status: "Shipped",
    });
  });
});
