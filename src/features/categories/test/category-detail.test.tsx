import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CategoryDetailPage from "../pages/CategoryDetailPage";
import { useGetCategoryDetail } from "../hooks/useGetCategoryDetail";
import { useGetCategoryProducts } from "../hooks/useGetCategoryProducts";
import { renderCategoriesPage } from "./test-utils";

vi.mock("../hooks/useGetCategoryDetail", () => ({
  useGetCategoryDetail: vi.fn(),
}));
vi.mock("../hooks/useGetCategoryProducts", () => ({
  useGetCategoryProducts: vi.fn(),
}));
vi.mock("../components/EditCategorySheet", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Edit category sheet</div> : null,
}));
vi.mock("../components/DeleteCategoryDialog", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Delete category dialog</div> : null,
}));
const category = {
  name: "Fresh Fruit",
  slug: "fresh-fruit",
  imageUrl: "fruit.png",
  createdAt: "2026-08-01T00:00:00Z",
  updatedAt: "2026-08-02T00:00:00Z",
};

describe("CategoryDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetCategoryProducts).mockReturnValue({
      data: { data: { data: [] } },
      isLoading: false,
      isFetching: false,
    } as unknown as ReturnType<typeof useGetCategoryProducts>);
  });

  it("renders loading and not-found states", () => {
    vi.mocked(useGetCategoryDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetCategoryDetail>);
    const view = renderCategoriesPage(
      <CategoryDetailPage />,
      "/categories/missing",
      "/categories/:slug",
    );
    expect(screen.getByText("Loading category details...")).toBeInTheDocument();
    view.unmount();

    vi.mocked(useGetCategoryDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useGetCategoryDetail>);
    renderCategoriesPage(
      <CategoryDetailPage />,
      "/categories/missing",
      "/categories/:slug",
    );
    expect(
      screen.getByRole("heading", { name: "Category not found" }),
    ).toBeInTheDocument();
  });

  it("renders category products and opens edit and delete controls", () => {
    vi.mocked(useGetCategoryDetail).mockReturnValue({
      data: { data: category },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetCategoryDetail>);
    vi.mocked(useGetCategoryProducts).mockReturnValue({
      data: {
        data: {
          data: [
            {
              name: "Apple",
              slug: "apple",
              stockQuantity: 5,
              categorySlug: "fresh-fruit",
              price: 2.5,
              productImageUrl: "apple.png",
            },
          ],
          pagination: { hasNext: false },
        },
      },
      isLoading: false,
      isFetching: false,
    } as unknown as ReturnType<typeof useGetCategoryProducts>);

    renderCategoriesPage(
      <CategoryDetailPage />,
      "/categories/fresh-fruit",
      "/categories/:slug",
    );

    expect(
      screen.getByRole("heading", { name: "Fresh Fruit" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("1 Product")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /edit category/i }));
    fireEvent.click(screen.getByRole("button", { name: /delete category/i }));

    expect(screen.getByText("Edit category sheet")).toBeInTheDocument();
    expect(screen.getByText("Delete category dialog")).toBeInTheDocument();
  });
});
