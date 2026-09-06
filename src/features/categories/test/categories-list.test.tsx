import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CategoriesListPage from "../pages/CategoriesListPage";
import { useGetCategories } from "../hooks/useGetCategories";
import { renderCategoriesPage } from "./test-utils";

vi.mock("../hooks/useGetCategories", () => ({ useGetCategories: vi.fn() }));
vi.mock("../components/CreateCategorySheet", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Create category sheet</div> : null,
}));
const category = {
  name: "Fresh Fruit",
  slug: "fresh-fruit",
  imageUrl: "fruit.png",
  createdAt: "2026-08-01T00:00:00Z",
  updatedAt: "2026-08-02T00:00:00Z",
};

describe("CategoriesListPage", () => {
  beforeEach(() => vi.clearAllMocks());
  it("renders categories and navigates to a selected category", () => {
    vi.mocked(useGetCategories).mockReturnValue({
      data: { data: { data: [category], pagination: { hasNext: false } } },
      isLoading: false,
      isFetching: false,
    } as ReturnType<typeof useGetCategories>);
    renderCategoriesPage(<CategoriesListPage />);
    expect(
      screen.getByRole("heading", { name: "Categories" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Fresh Fruit")).toBeInTheDocument();
    expect(screen.getByText("Showing 1 categories")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Fresh Fruit"));
    expect(screen.getByText("Category detail destination")).toBeInTheDocument();
  });
  it("renders loading and empty states", () => {
    vi.mocked(useGetCategories).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    } as ReturnType<typeof useGetCategories>);
    const view = renderCategoriesPage(<CategoriesListPage />);
    expect(view.container.querySelectorAll(".animate-pulse")).toHaveLength(8);
    view.unmount();
    vi.mocked(useGetCategories).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    } as ReturnType<typeof useGetCategories>);
    renderCategoriesPage(<CategoriesListPage />);
    expect(screen.getByText("No categories yet")).toBeInTheDocument();
  });
  it("opens the create category sheet", () => {
    vi.mocked(useGetCategories).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    } as ReturnType<typeof useGetCategories>);
    renderCategoriesPage(<CategoriesListPage />);
    fireEvent.click(screen.getByRole("button", { name: "Add category" }));
    expect(screen.getByText("Create category sheet")).toBeInTheDocument();
  });
});
