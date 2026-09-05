import { http } from "@/api/http";

export async function getProductApi(slug: string) {
  return await http.get(`/api/products/${slug}`);
}
