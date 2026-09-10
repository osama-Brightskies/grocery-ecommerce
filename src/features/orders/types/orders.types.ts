export type OrderStatus =
  "Pending" | "Placed" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  guid: string;
  orderNumber: string;
  total?: number;
  totalAmount?: number;
  address: string;
  creationDate: string;
  deliveryTime: string | null;
  userId?: string;
  firstName?: string;
  lastName?: string;
  totalItems?: number;
  status: OrderStatus;
  items?: unknown[];
};

export type CursorPaginationMeta = {
  nextCursor: string | null;
  hasNext: boolean;
  pageSize: number;
};

export type GetOrdersParams = {
  status?: OrderStatus;
  limit?: number;
  cursor?: string;
};

export type GetOrdersResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Order[];
    pagination?: CursorPaginationMeta;
  };
};

export type GetOrderDetailResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Order;
};

export type GetUserOrdersResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Order[];
    pagination?: CursorPaginationMeta;
  };
};

export type UpdateOrderStatusPayload = {
  status: OrderStatus;
};

export type UpdateOrderStatusResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Order;
};
