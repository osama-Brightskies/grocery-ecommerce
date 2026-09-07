import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../api/categories.api";
import type {
  GetCategoriesParams,
  GetCategoriesResponse,
} from "../types/categories.types";
import type { ApiError } from "@/api/errors";

export type UseGetCategoriesOptions = {
  enabled?: boolean;
};

export function useGetCategories(
  params?: GetCategoriesParams,
  options?: UseGetCategoriesOptions,
) {
  return useQuery<GetCategoriesResponse, ApiError>({
    queryKey: ["categories", params?.limit, params?.cursor],
    queryFn: () => getCategoriesApi(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}
