import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserOrdersApi } from "../api/orders.api";
import type { GetUserOrdersResponse } from "../types/orders.types";
import type { ApiError } from "@/api/errors";

export type UseGetUserOrdersOptions = {
  enabled?: boolean;
};

export function useGetUserOrders(
  userGuid: string,
  params?: { limit?: number; cursor?: string },
  options?: UseGetUserOrdersOptions,
) {
  return useQuery<GetUserOrdersResponse, ApiError>({
    queryKey: ["user-orders", userGuid, params?.limit, params?.cursor],
    queryFn: () => getUserOrdersApi(userGuid, params),
    enabled: options?.enabled ?? Boolean(userGuid),
    placeholderData: keepPreviousData,
  });
}
