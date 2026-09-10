import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { UserRole } from "@/store/types/authStore.types";
import { UserActivityTimeline } from "../components/UserActivityTimeline";
import { UserOrderHistoryCard } from "../components/UserOrderHistoryCard";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { useGetUserOrders } from "@/features/orders/hooks/useGetUserOrders";

vi.mock("@/features/orders/hooks/useGetUserOrders", () => ({
  useGetUserOrders: vi.fn(),
}));

const user = {
  guid: "12345678-abcd-efgh-ijkl-123456789012",
  firstName: "Mona",
  lastName: "Ali",
  email: "mona@example.com",
  phoneNumber: "+201234567890",
  role: UserRole.Admin,
  isActive: false,
  createdAt: "2026-08-20T10:00:00Z",
};

describe("UserActivityTimeline", () => {
  it("renders its loading and empty states", () => {
    const { rerender } = render(<UserActivityTimeline isLoading />);
    expect(screen.getByText("Loading activity history...")).toBeInTheDocument();

    rerender(<UserActivityTimeline activities={[]} />);
    expect(
      screen.getByText("No recent activities recorded for this user."),
    ).toBeInTheDocument();
  });

  it("filters corrupt entries and formats supported activity types and slugs", () => {
    render(
      <UserActivityTimeline
        activities={[
          {
            userId: "1",
            actionType: "AddToCart",
            slug: "green-tea",
            timestamp: "2026-08-21T11:00:00Z",
          },
          {
            userId: "1",
            actionType: "RemoveFromCart",
            slug: "red-apple",
            timestamp: "2026-08-21T12:00:00Z",
          },
          {
            userId: "1",
            actionType: "ViewedProduct",
            slug: "milk",
            timestamp: "2026-08-21T13:00:00Z",
          },
          {
            userId: "1",
            actionType: "CheckoutStarted",
            slug: "basket",
            timestamp: "2026-08-21T14:00:00Z",
          },
          {
            userId: "1",
            actionType: "AddToCart",
            slug: " ",
            timestamp: "2026-08-21T15:00:00Z",
          },
        ]}
      />,
    );

    expect(screen.getByText("Added to cart")).toBeInTheDocument();
    expect(screen.getByText("Removed from cart")).toBeInTheDocument();
    expect(screen.getByText("Viewed product")).toBeInTheDocument();
    expect(screen.getByText("Checkout Started")).toBeInTheDocument();
    expect(screen.getByText("Green Tea")).toBeInTheDocument();
    expect(screen.queryByText(/^\s+$/)).not.toBeInTheDocument();
  });
});

describe("UserProfileInfo", () => {
  it("renders profile values and inactive status", () => {
    render(<UserProfileInfo user={user} onEdit={vi.fn()} />);

    expect(screen.getByText("Mona")).toBeInTheDocument();
    expect(screen.getByText("Ali")).toBeInTheDocument();
    expect(screen.getByText("mona@example.com")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("+201234567890")).toBeInTheDocument();
  });

  it("calls the edit handler", () => {
    const onEdit = vi.fn();
    render(<UserProfileInfo user={user} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole("button", { name: /edit user/i }));
    expect(onEdit).toHaveBeenCalledOnce();
  });
});

describe("UserOrderHistoryCard", () => {
  it("renders user orders without the removed view-all action", () => {
    vi.mocked(useGetUserOrders).mockReturnValue({
      data: {
        success: true,
        statusCode: 200,
        message: "ok",
        data: {
          data: [
            {
              guid: "order-1",
              orderNumber: "1001",
              totalAmount: 25,
              totalItems: 2,
              address: "Cairo",
              creationDate: "2026-09-01T10:00:00Z",
              deliveryTime: null,
              status: "Placed",
            },
          ],
          pagination: {
            hasNext: false,
            nextCursor: null,
            pageSize: 10,
          },
        },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetUserOrders>);

    render(
      <MemoryRouter>
        <UserOrderHistoryCard userGuid="user-1" />
      </MemoryRouter>,
    );

    expect(useGetUserOrders).toHaveBeenCalledWith("user-1", { limit: 20 });
    expect(screen.getByText("#1001")).toBeInTheDocument();
    expect(screen.getByText("2 items")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /view all orders/i }),
    ).not.toBeInTheDocument();
  });
});
