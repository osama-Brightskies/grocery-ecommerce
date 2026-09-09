import { useQuery } from "@tanstack/react-query";
import { getAllUserActivitiesApi } from "../api/users.api";
import type { GetUserActivitiesResponse } from "../types/users.types";
import type { ApiError } from "@/api/errors";

export type UseGetAllUserActivitiesOptions = {
  enabled?: boolean;
};

export function useGetAllUserActivities(
  limit: number = 100,
  options?: UseGetAllUserActivitiesOptions,
) {
  return useQuery<GetUserActivitiesResponse, ApiError>({
    queryKey: ["all-user-activities", limit],
    queryFn: () => getAllUserActivitiesApi(limit),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });
}
