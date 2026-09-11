import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../api/categories.api";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useGetCategories } from "../hooks/useGetCategories";
import { useGetCategoryDetail } from "../hooks/useGetCategoryDetail";
import { useGetCategoryProducts } from "../hooks/useGetCategoryProducts";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/categories.schema";

vi.mock("../api/categories.api", () => ({
  getCategoriesApi: vi.fn(),
  getCategoryBySlugApi: vi.fn(),
  getCategoryProductsApi: vi.fn(),
  createCategoryApi: vi.fn(),
  updateCategoryApi: vi.fn(),
  deleteCategoryApi: vi.fn(),
}));

// Hoisted QueryClient so we can spy on it
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function wrapper() {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const category = {
  name: "Fresh Fruit",
  slug: "fresh-fruit",
  imageUrl: "fruit.png",
  createdAt: "2026-08-01T00:00:00Z",
  updatedAt: "2026-08-02T00:00:00Z",
};
const response = {
  success: true,
  statusCode: 200,
  message: "ok",
  data: category,
};

describe("category query hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("loads categories and category products with their parameters", async () => {
    vi.mocked(api.getCategoriesApi).mockResolvedValue({
      ...response,
      data: { data: [category] },
    });
    vi.mocked(api.getCategoryProductsApi).mockResolvedValue({
      ...response,
      data: { data: [] },
    });
    const { result } = renderHook(
      () => ({
        categories: useGetCategories({ limit: 8 }),
        products: useGetCategoryProducts("fresh-fruit", { limit: 5 }),
      }),
      { wrapper: wrapper() },
    );
    await waitFor(() =>
      expect(
        result.current.categories.isSuccess &&
          result.current.products.isSuccess,
      ).toBe(true),
    );
    expect(api.getCategoriesApi).toHaveBeenCalledWith({ limit: 8 });
    expect(api.getCategoryProductsApi).toHaveBeenCalledWith("fresh-fruit", {
      limit: 5,
    });
  });

  it("does not load category detail without a slug", () => {
    const { result } = renderHook(() => useGetCategoryDetail(""), {
      wrapper: wrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(api.getCategoryBySlugApi).not.toHaveBeenCalled();
  });
});

describe("category mutation hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("passes create, update, and delete inputs to their APIs and invalidates cache", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(api.createCategoryApi).mockResolvedValue(response);
    vi.mocked(api.updateCategoryApi).mockResolvedValue(response);
    vi.mocked(api.deleteCategoryApi).mockResolvedValue(undefined);

    const formData = new FormData();
    const { result } = renderHook(
      () => ({
        create: useCreateCategory(),
        update: useUpdateCategory(),
        remove: useDeleteCategory(),
      }),
      { wrapper: wrapper() },
    );

    act(() => {
      result.current.create.mutate(formData);
      result.current.update.mutate({ slug: "fresh-fruit", formData });
      result.current.remove.mutate("fresh-fruit");
    });

    await waitFor(() =>
      expect(
        result.current.create.isSuccess &&
          result.current.update.isSuccess &&
          result.current.remove.isSuccess,
      ).toBe(true),
    );

    expect(api.createCategoryApi).toHaveBeenCalledWith(formData);
    expect(api.updateCategoryApi).toHaveBeenCalledWith("fresh-fruit", formData);
    expect(api.deleteCategoryApi).toHaveBeenCalledWith("fresh-fruit");

    // Lists are invalidated once per mutation, while the update response seeds detail data.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
    expect(setQueryDataSpy).toHaveBeenCalledWith(
      ["category-detail", "fresh-fruit"],
      response,
    );
  });
});

describe("category schemas", () => {
  const image = new File(["image"], "fruit.png", { type: "image/png" });
  it("accepts valid create and update values", () => {
    expect(
      createCategorySchema.safeParse({ name: "Fruit", image }).success,
    ).toBe(true);
    expect(updateCategorySchema.safeParse({ name: "Fruit" }).success).toBe(
      true,
    );
  });
  it("rejects short names and unsupported image types", () => {
    const badImage = new File(["text"], "notes.txt", { type: "text/plain" });
    expect(
      createCategorySchema.safeParse({ name: "F", image: badImage }).success,
    ).toBe(false);
  });
});
