import { http } from "@/api/http";
import type { Tag } from "@/features/tags/types/tags.types";

export async function getTagsApi(page = 1, pageSize = 10000) {
  return await http.get<{ items: Tag[]; totalPages: number }>("/api/tags", {
    params: { PageNumber: page, PageSize: pageSize },
  });
}