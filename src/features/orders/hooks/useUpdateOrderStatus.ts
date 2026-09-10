import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatusApi } from "../api/orders.api";
import type {
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
} from "../types/orders.types";
import type { ApiError } from "@/api/errors";

export type UseUpdateOrderStatusOptions = {
  onSuccess?: (data: UpdateOrderStatusResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useUpdateOrderStatus(options?: UseUpdateOrderStatusOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateOrderStatusResponse,
    ApiError,
    { guid: string; payload: UpdateOrderStatusPayload }
  >({
    mutationFn: ({ guid, payload }) => updateOrderStatusApi(guid, payload),

    onSuccess: async (data, variables) => {
      // Refresh the orders table, the open order detail, and any open user order history in parallel
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({
          queryKey: ["order-detail", variables.guid],
        }),
        queryClient.invalidateQueries({ queryKey: ["user-orders"] }),
      ]);

      options?.onSuccess?.(data);
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
