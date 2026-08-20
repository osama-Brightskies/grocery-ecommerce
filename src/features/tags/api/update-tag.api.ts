import { http } from "@/api/http";
export const updateTagApi = (slug: string, data: { name: string }) => http.put(`/api/tags/${slug}`, data);