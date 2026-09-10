import { useQuery } from "@tanstack/react-query";
import { getOrderDetailApi } from "../api/orders.api";
import type { GetOrderDetailResponse } from "../types/orders.types";
import type { ApiError } from "@/api/errors";

export type UseGetOrderDetailOptions = {
  enabled?: boolean;
};

export function useGetOrderDetail(
  guid: string,
  options?: UseGetOrderDetailOptions,
) {
  return useQuery<GetOrderDetailResponse, ApiError>({
    queryKey: ["order-detail", guid],
    queryFn: () => getOrderDetailApi(guid),
    enabled: options?.enabled ?? Boolean(guid),
    retry: false,
  });
}
