import { http } from "@/api/http";

export async function getProductsApi(limit: number = 10, cursor?: string) {
  return await http.get("/api/products", {
    params: {
      Limit: limit,
      ...(cursor ? { Cursor: cursor } : {}),
    },
  });
}
