import type { ProductItem } from "@/features/products/types/products.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function fetchProducts(page: number = 1, limit: number = 5): Promise<{ data: ProductItem[]; total: number }> {
  try {
    const skip = (page - 1) * limit;
    const response = await fetch(`${API_BASE_URL}/products?_page=${page}&_limit=${limit}&limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch products from API");
    }

    const json = await response.json();

    let data: ProductItem[] = [];
    let total = 0;

    if (Array.isArray(json)) {
      data = json;
      total = json.length;
    } else if (json && Array.isArray(json.products)) {
      data = json.products;
      total = json.total || json.products.length;
    } else if (json && Array.isArray(json.data)) {
      data = json.data;
      total = json.total || json.data.length;
    }

    const headerTotal = response.headers.get("X-Total-Count");
    if (headerTotal) {
      total = Number(headerTotal);
    }

    return { data, total };
  } catch (error) {
    console.error("API Error:", error);
    return { data: [], total: 0 };
  }
}

export async function deleteProduct(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
} 