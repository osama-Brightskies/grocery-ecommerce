import { useQuery } from "@tanstack/react-query";
import { getUserActivitiesApi } from "../api/users.api";
import type { GetUserActivitiesResponse } from "../types/users.types";
import type { ApiError } from "@/api/errors";

type UseGetUserActivitiesOptions = {
  enabled?: boolean;
  onSuccess?: (data: GetUserActivitiesResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useGetUserActivities(
  userId?: string,
  options?: UseGetUserActivitiesOptions,
) {
  return useQuery({
    queryKey: ["user-activities", userId],
    queryFn: async () => {
      try {
        const data = await getUserActivitiesApi(userId);
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        options?.onError?.(error as ApiError);
        throw error;
      }
    },
    enabled: options?.enabled ?? true,
  });
}