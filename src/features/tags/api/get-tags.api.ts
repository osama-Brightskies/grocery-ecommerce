import { http } from "@/api/http";
import type { GetTagsResponse } from "@/features/tags/types/tags.types";

export async function getTagsApi(page: number, pageSize: number) {
  return await http.get<GetTagsResponse>("/api/tags", {
    params: { PageNumber: page, PageSize: pageSize },
  });
}
