import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { OrderInformationCard } from "../components/OrderInformationCard";
import { OrderItemsCard } from "../components/OrderItemsCard";
import { OrderStatusCell } from "../components/OrderStatusCell";
import { OrdersStatusFilter } from "../components/OrderStatusFilter";
import { OrderStatusStepper } from "../components/OrderStatusStepper";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";

vi.mock("../hooks/useUpdateOrderStatus", () => ({
  useUpdateOrderStatus: vi.fn(),
}));
const mutate = vi.fn();
const order = {
  guid: "order-1",
  orderNumber: "1001",
  address: "Cairo",
  creationDate: "2026-09-01T10:00:00Z",
  deliveryTime: null,
  status: "Placed" as const,
};

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("order components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateOrderStatus).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateOrderStatus>);
  });

  it("changes the selected status filter", async () => {
    const onStatusChange = vi.fn();
    render(
      <OrdersStatusFilter
        selectedStatus="All"
        onStatusChange={onStatusChange}
      />,
    );
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByRole("option", { name: "Shipped" }));
    expect(onStatusChange).toHaveBeenCalledWith("Shipped");
  });

  it("allows placed orders to ship or cancel", async () => {
    render(<OrderStatusCell order={order} isEditing onStopEditing={vi.fn()} />);
    expect(
      await screen.findByRole("option", { name: "Mark as Shipped" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Mark as Cancelled" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "Mark as Cancelled" }));
    expect(mutate).toHaveBeenCalledWith({
      guid: "order-1",
      payload: { status: "Cancelled" },
    });
  });

  it("does not offer editing for terminal orders", () => {
    render(
      <OrderStatusCell
        order={{ ...order, status: "Delivered" }}
        isEditing
        onStopEditing={vi.fn()}
      />,
    );
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("shows current actions for active and cancelled progress", () => {
    const view = render(<OrderStatusStepper status="Shipped" />);
    expect(
      screen.getByText("Mark as delivered (Final step)"),
    ).toBeInTheDocument();
    view.rerender(<OrderStatusStepper status="Cancelled" />);
    expect(screen.getByText("Order has been cancelled")).toBeInTheDocument();
    expect(screen.getAllByText("Cancelled").length).toBeGreaterThan(0);
  });

  it("renders order items with quantities, prices, subtotals, and product links", () => {
    render(
      <MemoryRouter>
        <OrderItemsCard
          items={[
            {
              name: "Green Tea",
              slug: "green-tea",
              quantity: 2,
              unitPrice: 3.5,
              productImage: "tea.png",
              altText: "A box of green tea",
              description: "Twenty tea bags",
            },
            {
              name: "Milk",
              slug: "milk",
              quantity: 1,
              unitPrice: 2,
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("3 total items")).toBeInTheDocument();
    expect(screen.getByText("Twenty tea bags")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "A box of green tea" }),
    ).toHaveAttribute("src", expect.stringContaining("tea.png"));
    expect(screen.getByRole("link", { name: /green tea/i })).toHaveAttribute(
      "href",
      "/products/green-tea",
    );
    expect(screen.getByText("$3.50")).toBeInTheDocument();
    expect(screen.getByText("$7.00")).toBeInTheDocument();
    expect(screen.getAllByText("$2.00")).toHaveLength(2);
  });

  it("renders the empty order-items state", () => {
    render(
      <MemoryRouter>
        <OrderItemsCard />
      </MemoryRouter>,
    );

    expect(screen.getByText("0 total items")).toBeInTheDocument();
    expect(
      screen.getByText("No item details available for this order."),
    ).toBeInTheDocument();
  });

  it("derives the item count and rejects an uninitialized delivery time", () => {
    render(
      <OrderInformationCard
        order={{
          ...order,
          total: 9,
          deliveryTime: "0001-01-01T00:00:00Z",
          items: [
            {
              name: "Apple",
              slug: "apple",
              quantity: 2,
              unitPrice: 2,
            },
            {
              name: "Pear",
              slug: "pear",
              quantity: 1,
              unitPrice: 5,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("$9.00")).toBeInTheDocument();
    expect(screen.getByText("3 items")).toBeInTheDocument();
    expect(screen.getByText("Not scheduled yet")).toBeInTheDocument();
  });
});
