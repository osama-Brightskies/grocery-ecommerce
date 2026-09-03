import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserRole } from "@/store/types/authStore.types";
import { UserActivityTimeline } from "../components/UserActivityTimeline";
import { UserProfileInfo } from "../components/UserProfileInfo";

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
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders profile values, role, and inactive status", () => {
    render(<UserProfileInfo user={user} />);

    expect(screen.getByText("Mona")).toBeInTheDocument();
    expect(screen.getByText("Ali")).toBeInTheDocument();
    expect(screen.getByText("mona@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("12345678...789012")).toBeInTheDocument();
  });

  it("copies the complete user id", () => {
    vi.useFakeTimers();
    render(<UserProfileInfo user={user} />);

    fireEvent.click(screen.getByText("12345678...789012"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(user.guid);
    act(() => vi.advanceTimersByTime(2000));
  });
});
