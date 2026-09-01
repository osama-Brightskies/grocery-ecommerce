import { http } from "@/api/http";
export const createTagApi = (data: { name: string }) =>
  http.post("/api/tags", data);
