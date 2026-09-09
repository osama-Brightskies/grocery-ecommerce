import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrdersApi } from "../api/orders.api";
import type { GetOrdersParams, GetOrdersResponse } from "../types/orders.types";
import type { ApiError } from "@/api/errors";

export type UseGetOrdersOptions = {
  enabled?: boolean;
};

export function useGetOrders(
  params?: GetOrdersParams,
  options?: UseGetOrdersOptions,
) {
  return useQuery<GetOrdersResponse, ApiError>({
    queryKey: ["orders", params?.status, params?.limit, params?.cursor],
    queryFn: () => getOrdersApi(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}
