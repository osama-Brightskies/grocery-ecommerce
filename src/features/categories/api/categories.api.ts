import { http } from "@/api";
import type {
  GetCategoriesParams,
  GetCategoriesResponse,
  GetCategoryDetailResponse,
  GetCategoryProductsResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
} from "../types/categories.types";

export const getCategoriesApi = (params?: GetCategoriesParams) => {
  return http.get<GetCategoriesResponse>("/api/categories", {
    params: {
      Limit: params?.limit,
      Cursor: params?.cursor,
    },
  });
};

export const getCategoryBySlugApi = (slug: string) => {
  return http.get<GetCategoryDetailResponse>(`/api/categories/${slug}`);
};

export const getCategoryProductsApi = (
  slug: string,
  params?: GetCategoriesParams,
) => {
  return http.get<GetCategoryProductsResponse>(
    `/api/categories/${slug}/products`,
    {
      params: {
        Limit: params?.limit,
        Cursor: params?.cursor,
      },
    },
  );
};

export const createCategoryApi = (formData: FormData) => {
  return http.post<CreateCategoryResponse>("/api/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCategoryApi = (slug: string, formData: FormData) => {
  return http.put<UpdateCategoryResponse>(`/api/categories/${slug}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCategoryApi = (slug: string) => {
  return http.delete<void>(`/api/categories/${slug}`);
};
