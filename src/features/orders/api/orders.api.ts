import { http } from "@/api";
import type {
  GetOrdersParams,
  GetOrdersResponse,
  GetOrderDetailResponse,
  GetUserOrdersResponse,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
} from "../types/orders.types";

/**
 * 1. Fetch Orders List (Supports Status filter, Limit, and Cursor pagination)
 */
export const getOrdersApi = (params?: GetOrdersParams) => {
  return http.get<GetOrdersResponse>("/api/orders", {
    params: {
      Status: params?.status === undefined ? undefined : params.status,
      Limit: params?.limit,
      Cursor: params?.cursor,
    },
  });
};

/**
 * 2. Fetch Single Order Details by GUID
 */
export const getOrderDetailApi = (guid: string) => {
  return http.get<GetOrderDetailResponse>(`/api/orders/${guid}`);
};

/**
 * 3. Fetch Orders Placed by a Specific User
 */
export const getUserOrdersApi = (
  userGuid: string,
  params?: { limit?: number; cursor?: string },
) => {
  return http.get<GetUserOrdersResponse>(`/api/orders/user/${userGuid}`, {
    params: {
      Limit: params?.limit,
      Cursor: params?.cursor,
    },
  });
};

/**
 * 4. Update Order Status (Pending -> Placed -> Shipped -> Delivered / Cancelled)
 */
export const updateOrderStatusApi = (
  guid: string,
  payload: UpdateOrderStatusPayload,
) => {
  return http.put<UpdateOrderStatusResponse>(
    `/api/orders/${guid}/status`,
    payload,
  );
};
