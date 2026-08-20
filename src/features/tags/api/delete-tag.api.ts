import { http } from "@/api/http";
export const deleteTagApi = (slug: string) => http.delete(`/api/tags/${slug}`);