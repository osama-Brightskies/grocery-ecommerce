import { http } from "@/api";
import type { SingleProductResponse } from "../types/products.types";

export function getProductApi(slug: string) {
  return http.get<SingleProductResponse>(`/api/products/${slug}`);
}
