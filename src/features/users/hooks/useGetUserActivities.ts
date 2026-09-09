import { useQuery } from "@tanstack/react-query";
import { getUserActivitiesApi } from "../api/users.api";
import type { GetUserActivitiesResponse } from "../types/users.types";
import type { ApiError } from "@/api/errors";

export type UseGetUserActivitiesOptions = {
  enabled?: boolean;
};

export function useGetUserActivities(
  userId: string,
  options?: UseGetUserActivitiesOptions,
) {
  return useQuery<GetUserActivitiesResponse, ApiError>({
    queryKey: ["user-activities", userId],
    queryFn: () => getUserActivitiesApi(userId),
    enabled: options?.enabled ?? Boolean(userId),
  });
}
