import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlugApi } from "../api/categories.api";
import type { GetCategoryDetailResponse } from "../types/categories.types";
import type { ApiError } from "@/api/errors";

export type UseGetCategoryDetailOptions = {
  enabled?: boolean;
};

export function useGetCategoryDetail(
  slug: string,
  options?: UseGetCategoryDetailOptions,
) {
  return useQuery<GetCategoryDetailResponse, ApiError>({
    queryKey: ["category-detail", slug],
    queryFn: () => getCategoryBySlugApi(slug),
    enabled: options?.enabled ?? Boolean(slug),
    retry: false,
  });
}
