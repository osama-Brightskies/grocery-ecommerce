import { useQuery } from "@tanstack/react-query";
import { getUserByIdApi } from "../api/users.api";
import type { GetUserDetailResponse } from "../types/users.types";
import type { ApiError } from "@/api/errors";

type UseGetUserDetailOptions = {
  enabled?: boolean;
  onSuccess?: (data: GetUserDetailResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useGetUserDetail(
  userId: string,
  options?: UseGetUserDetailOptions,
) {
  return useQuery({
    queryKey: ["users", "detail", userId],
    queryFn: async () => {
      try {
        const data = await getUserByIdApi(userId);
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        options?.onError?.(error as ApiError);
        throw error;
      }
    },
    enabled: options?.enabled ?? Boolean(userId),
  });
}
