import { http } from "@/api/http";

export interface ProductFilters {
  CategorySlug?: string;
  Tags?: string[];
  MinPrice?: number;
  MaxPrice?: number;
  InStock?: boolean | "";
  Search?: string;
  SortBy?: string;
  SortDir?: string;
}

export async function getProductsApi(
  limit: number = 10,
  cursor?: string,
  filters?: ProductFilters,
) {
  const params: Record<string, string | number | boolean | string[]> = {
    Limit: limit,
    ...(cursor ? { Cursor: cursor } : {}),
    _t: Date.now(), // <-- BUSTS AGGRESSIVE BROWSER CACHE!
  };

  if (filters) {
    if (filters.CategorySlug) params.CategorySlug = filters.CategorySlug;
    if (filters.MinPrice !== undefined) params.MinPrice = filters.MinPrice;
    if (filters.MaxPrice !== undefined) params.MaxPrice = filters.MaxPrice;
    if (filters.InStock === true || filters.InStock === false)
      params.InStock = filters.InStock;
    if (filters.Search) params.Search = filters.Search;
    if (filters.SortBy) params.SortBy = filters.SortBy;
    if (filters.SortDir) params.SortDir = filters.SortDir;
    if (filters.Tags && filters.Tags.length > 0) params.Tags = filters.Tags;
  }

  return await http.get("/api/products", { params });
}
