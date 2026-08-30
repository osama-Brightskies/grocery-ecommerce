import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsersApi } from "../api/users.api";
import type { GetUsersParams, GetUsersResponse } from "../types/users.types";
import type { ApiError } from "@/api/errors";

type UseGetUsersOptions = {
  enabled?: boolean;
  onSuccess?: (data: GetUsersResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useGetUsers(
  params?: GetUsersParams,
  options?: UseGetUsersOptions,
) {
  return useQuery({
    queryKey: ["users", params?.pageNumber ?? 1, params?.pageSize ?? 10],
    queryFn: async () => {
      try {
        const data = await getUsersApi(params);
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        options?.onError?.(error as ApiError);
        throw error;
      }
    },
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}