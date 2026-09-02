import { useQuery } from "@tanstack/react-query";
import { getUserByIdApi } from "../api/users.api";
import type { GetUserDetailResponse } from "../types/users.types";
import type { ApiError } from "@/api/errors";

export type UseGetUserDetailOptions = {
  enabled?: boolean;
};

export function useGetUserDetail(
  userId: string,
  options?: UseGetUserDetailOptions,
) {
  return useQuery<GetUserDetailResponse, ApiError>({
    queryKey: ["user-detail", userId],
    queryFn: () => getUserByIdApi(userId),
    enabled: options?.enabled ?? Boolean(userId),
    retry: false,
  });
}
