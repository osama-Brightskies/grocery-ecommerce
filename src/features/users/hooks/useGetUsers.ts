import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsersApi } from "../api/users.api";
import type { GetUsersParams, GetUsersResponse } from "../types/users.types";
import type { ApiError } from "@/api/errors";

export type UseGetUsersOptions = {
  enabled?: boolean;
};

export function useGetUsers(
  params: GetUsersParams, // 👈 Required, no optional '?'
  options?: UseGetUsersOptions,
) {
  return useQuery<GetUsersResponse, ApiError>({
    queryKey: ["users", params.pageNumber, params.pageSize],
    queryFn: () => getUsersApi(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}
