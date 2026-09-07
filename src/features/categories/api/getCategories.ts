import { http } from "@/api/http";

export type Category = {
  name: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
};

export type PaginatedCategoriesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Category[];
    pagination: {
      nextCursor: string | null;
      hasNext: boolean;
      pageSize: number;
    };
  };
};

export async function getCategoriesApi(limit: number = 100) {
  return await http.get<PaginatedCategoriesResponse>("/api/categories", {
    params: { Limit: limit },
  });
}
