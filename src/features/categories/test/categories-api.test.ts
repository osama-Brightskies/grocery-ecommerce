import { afterEach, describe, expect, it, vi } from "vitest";
import { http } from "@/api";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  getCategoryBySlugApi,
  getCategoryProductsApi,
  updateCategoryApi,
} from "../api/categories.api";

describe("categories API contracts", () => {
  afterEach(() => vi.restoreAllMocks());

  it("maps cursor pagination to the API parameter casing", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);
    await getCategoriesApi({ limit: 8, cursor: "next-page" });
    expect(http.get).toHaveBeenCalledWith("/api/categories", {
      params: { Limit: 8, Cursor: "next-page" },
    });
  });

  it("gets category details and products by slug", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);
    await getCategoryBySlugApi("fresh-fruit");
    await getCategoryProductsApi("fresh-fruit", { limit: 5, cursor: "two" });
    expect(http.get).toHaveBeenNthCalledWith(1, "/api/categories/fresh-fruit");
    expect(http.get).toHaveBeenNthCalledWith(
      2,
      "/api/categories/fresh-fruit/products",
      {
        params: { Limit: 5, Cursor: "two" },
      },
    );
  });

  it("creates and updates categories as multipart form data", async () => {
    vi.spyOn(http, "post").mockResolvedValue(undefined);
    vi.spyOn(http, "put").mockResolvedValue(undefined);
    const formData = new FormData();
    formData.append("Name", "Fresh Fruit");
    await createCategoryApi(formData);
    await updateCategoryApi("fresh-fruit", formData);
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    expect(http.post).toHaveBeenCalledWith("/api/categories", formData, config);
    expect(http.put).toHaveBeenCalledWith(
      "/api/categories/fresh-fruit",
      formData,
      config,
    );
  });

  it("deletes a category by slug", async () => {
    vi.spyOn(http, "delete").mockResolvedValue(undefined);
    await deleteCategoryApi("fresh-fruit");
    expect(http.delete).toHaveBeenCalledWith("/api/categories/fresh-fruit");
  });
});
