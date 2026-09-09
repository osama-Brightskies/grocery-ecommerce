import type { OrderStatus } from "../types/orders.types";

export const STATUS_FILTER_OPTIONS: {
  label: string;
  value: OrderStatus | "All";
}[] = [
  { label: "All statuses", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Placed", value: "Placed" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];
