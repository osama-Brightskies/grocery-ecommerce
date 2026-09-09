import { afterEach, describe, expect, it, vi } from "vitest";
import { http } from "@/api/http";
import { getProductsApi } from "../api/getProducts";
import { getProductApi } from "../api/getProduct";
import { createProductApi } from "../api/createProduct";
import { updateProductApi } from "../api/updateProduct";
import { deleteProductApi } from "../api/deleteProduct";

describe("products API contracts", () => {
  afterEach(() => vi.restoreAllMocks());
  it("gets product lists with cursor pagination", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);
    await getProductsApi(20, "next");
    expect(http.get).toHaveBeenCalledWith("/api/products", {
      params: { Limit: 20, Cursor: "next" },
    });
  });
  it("gets, creates, updates and deletes products", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);
    vi.spyOn(http, "post").mockResolvedValue(undefined);
    vi.spyOn(http, "put").mockResolvedValue(undefined);
    vi.spyOn(http, "delete").mockResolvedValue(undefined);
    const data = new FormData();
    await getProductApi("apple");
    await createProductApi(data);
    await updateProductApi({ slug: "apple", formData: data });
    await deleteProductApi("apple");
    expect(http.get).toHaveBeenCalledWith("/api/products/apple");
    expect(http.post).toHaveBeenCalledWith(
      "/api/products",
      data,
      expect.any(Object),
    );
    expect(http.put).toHaveBeenCalledWith(
      "/api/products/apple",
      data,
      expect.any(Object),
    );
    expect(http.delete).toHaveBeenCalledWith("/api/products/apple");
  });
});
