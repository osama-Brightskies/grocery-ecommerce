import { fireEvent, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import OrdersListPage from "../pages/OrdersListPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import { useGetOrders } from "../hooks/useGetOrders";
import { useGetOrderDetail } from "../hooks/useGetOrderDetail";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { renderOrdersPage } from "./test-utils";

vi.mock("../hooks/useGetOrders", () => ({ useGetOrders: vi.fn() }));
vi.mock("../hooks/useGetOrderDetail", () => ({ useGetOrderDetail: vi.fn() }));
vi.mock("../hooks/useUpdateOrderStatus", () => ({
  useUpdateOrderStatus: vi.fn(),
}));

const mutate = vi.fn();
const order = {
  guid: "order-1",
  orderNumber: "1001",
  total: 25,
  totalItems: 2,
  firstName: "Mona",
  lastName: "Ali",
  address: "Cairo",
  creationDate: "2026-09-01T10:00:00Z",
  deliveryTime: null,
  status: "Placed" as const,
};

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("orders pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateOrderStatus).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateOrderStatus>);
  });

  it("renders orders, filters them, and navigates to details", async () => {
    vi.mocked(useGetOrders).mockReturnValue({
      data: { data: { data: [order], pagination: { hasNext: false } } },
      isLoading: false,
      isFetching: false,
    } as ReturnType<typeof useGetOrders>);
    renderOrdersPage(<OrdersListPage />);
    expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByText("Mona Ali")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByRole("option", { name: "Shipped" }));
    expect(useGetOrders).toHaveBeenLastCalledWith({
      status: "Shipped",
      limit: 10,
      cursor: undefined,
    });
    fireEvent.click(screen.getByTitle("View order details"));
    expect(screen.getByText("Order destination")).toBeInTheDocument();
  });

  it("loads the next page and keeps existing orders", () => {
    vi.mocked(useGetOrders).mockImplementation(
      (params) =>
        ({
          data: {
            data: {
              data: params?.cursor
                ? [{ ...order, guid: "order-2", orderNumber: "1002" }]
                : [order],
              pagination: params?.cursor
                ? { hasNext: false }
                : { hasNext: true, nextCursor: "page-2" },
            },
          },
          isLoading: false,
          isFetching: false,
        }) as ReturnType<typeof useGetOrders>,
    );

    renderOrdersPage(<OrdersListPage />);
    fireEvent.click(screen.getByRole("button", { name: /load more orders/i }));

    expect(useGetOrders).toHaveBeenLastCalledWith({
      status: undefined,
      limit: 10,
      cursor: "page-2",
    });
    expect(screen.getByText("#1001")).toBeInTheDocument();
    expect(screen.getByText("#1002")).toBeInTheDocument();
    expect(screen.getByText("Showing 2 orders")).toBeInTheDocument();
  });

  it("renders list loading and empty states", () => {
    vi.mocked(useGetOrders).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    } as ReturnType<typeof useGetOrders>);
    const view = renderOrdersPage(<OrdersListPage />);
    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
    view.unmount();
    vi.mocked(useGetOrders).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    } as ReturnType<typeof useGetOrders>);
    renderOrdersPage(<OrdersListPage />);
    expect(screen.getByText("No orders found")).toBeInTheDocument();
  });

  it("renders detail loading and not-found states", () => {
    vi.mocked(useGetOrderDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetOrderDetail>);
    const view = renderOrdersPage(
      <OrderDetailPage />,
      "/orders/missing",
      "/orders/:guid",
    );
    expect(screen.getByText("Loading order details...")).toBeInTheDocument();
    view.unmount();
    vi.mocked(useGetOrderDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useGetOrderDetail>);
    renderOrdersPage(<OrderDetailPage />, "/orders/missing", "/orders/:guid");
    expect(
      screen.getByRole("heading", { name: "Order not found" }),
    ).toBeInTheDocument();
  });

  it("advances and cancels a placed order", () => {
    vi.mocked(useGetOrderDetail).mockReturnValue({
      data: { data: order },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetOrderDetail>);
    renderOrdersPage(<OrderDetailPage />, "/orders/order-1", "/orders/:guid");
    expect(
      screen.getByRole("heading", { name: "Order #1001" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /mark as shipped/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel order/i }));
    expect(mutate).toHaveBeenNthCalledWith(1, {
      guid: "order-1",
      payload: { status: "Shipped" },
    });
    expect(mutate).toHaveBeenNthCalledWith(2, {
      guid: "order-1",
      payload: { status: "Cancelled" },
    });
  });

  it("navigates back and hides actions for a delivered order", () => {
    vi.mocked(useGetOrderDetail).mockReturnValue({
      data: { data: { ...order, status: "Delivered" } },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetOrderDetail>);
    renderOrdersPage(<OrderDetailPage />, "/orders/order-1", "/orders/:guid");

    expect(
      screen.queryByRole("button", { name: /mark as/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel order/i }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /back to orders/i }));
    expect(screen.getByText("Orders destination")).toBeInTheDocument();
  });
});
