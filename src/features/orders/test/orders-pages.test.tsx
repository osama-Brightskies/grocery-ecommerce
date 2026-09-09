import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

describe("orders pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateOrderStatus).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateOrderStatus>);
  });

  it("renders orders, filters them, and navigates to details", () => {
    vi.mocked(useGetOrders).mockReturnValue({
      data: { data: { data: [order], pagination: { hasNext: false } } },
      isLoading: false,
      isFetching: false,
    } as ReturnType<typeof useGetOrders>);
    renderOrdersPage(<OrdersListPage />);
    expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByText("Mona Ali")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Shipped" },
    });
    expect(useGetOrders).toHaveBeenLastCalledWith({
      status: "Shipped",
      limit: 10,
      cursor: undefined,
    });
    fireEvent.click(screen.getByTitle("View order details"));
    expect(screen.getByText("Order destination")).toBeInTheDocument();
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
});
