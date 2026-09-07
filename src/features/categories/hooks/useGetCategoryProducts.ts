import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategoryProductsApi } from "../api/categories.api";
import type {
  GetCategoriesParams,
  GetCategoryProductsResponse,
} from "../types/categories.types";
import type { ApiError } from "@/api/errors";

export type UseGetCategoryProductsOptions = {
  enabled?: boolean;
};

export function useGetCategoryProducts(
  slug: string,
  params?: GetCategoriesParams,
  options?: UseGetCategoryProductsOptions,
) {
  return useQuery<GetCategoryProductsResponse, ApiError>({
    queryKey: ["category-products", slug, params?.limit, params?.cursor],
    queryFn: () => getCategoryProductsApi(slug, params),
    enabled: options?.enabled ?? Boolean(slug),
    placeholderData: keepPreviousData,
  });
}
