import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { CategoryCard } from "../components/CategoryCard";
import { CategoryHeaderCard } from "../components/CategoryHeaderCard";
import { CategoryProductsTable } from "../components/CategoryProductsTable";

const category = {
  name: "Fresh Fruit",
  slug: "fresh-fruit",
  imageUrl: "fruit.png",
  createdAt: "2026-08-01T00:00:00Z",
  updatedAt: "2026-08-02T00:00:00Z",
};

describe("category components", () => {
  it("renders category summary information and cache-busted images", () => {
    render(
      <MemoryRouter>
        <CategoryCard category={category} productCount={3} />
        <CategoryHeaderCard category={category} productsCount={1} />
      </MemoryRouter>,
    );
    expect(screen.getAllByText("Fresh Fruit")).toHaveLength(2);
    expect(screen.getByText("3 products")).toBeInTheDocument();
    expect(screen.getByText("1 Product")).toBeInTheDocument();
    expect(
      screen.getAllByRole("img", { name: "Fresh Fruit" })[0],
    ).toHaveAttribute("src", expect.stringContaining("?v="));
  });

  it("triggers onEdit and onDelete callbacks from CategoryCard", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <CategoryCard category={category} onEdit={onEdit} onDelete={onDelete} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTitle("Edit category"));
    expect(onEdit).toHaveBeenCalledWith(category);

    fireEvent.click(screen.getByTitle("Delete category"));
    expect(onDelete).toHaveBeenCalledWith(category);
  });

  it("renders product prices and stock states and loads more", () => {
    const onLoadMore = vi.fn();
    render(
      <MemoryRouter>
        <CategoryProductsTable
          products={[
            {
              name: "Apple",
              slug: "apple",
              stockQuantity: 0,
              categorySlug: "fresh-fruit",
              price: 2.5,
              productImageUrl: "apple.png",
            },
            {
              name: "Pear",
              slug: "pear",
              stockQuantity: 5,
              categorySlug: "fresh-fruit",
              price: 3,
              productImageUrl: "pear.png",
            },
            {
              name: "Orange",
              slug: "orange",
              stockQuantity: 20,
              categorySlug: "fresh-fruit",
              price: 4,
              productImageUrl: "orange.png",
            },
          ]}
          hasNext
          onLoadMore={onLoadMore}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("$2.50")).toBeInTheDocument();
    expect(screen.getByText("No stock (0)")).toBeInTheDocument();
    expect(screen.getByText("Low stock (5)")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });
});
