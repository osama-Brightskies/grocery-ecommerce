import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import { StatusBadge } from "../components/status-badge";
import { getProductsColumns } from "../types/products.columns";
import type { Product } from "../types/products.types";

const product: Product = {
  name: "Apple",
  slug: "apple",
  description: "Fresh apple",
  price: 2.5,
  stockQuantity: 0,
  productImageUrl: "apple.png",
  isFavorited: false,
  creationDate: "2026-08-01T00:00:00Z",
  categorySlug: "fruit",
  tags: ["fresh"],
};

describe("product components", () => {
  it("maps stock status badge variants", () => {
    render(
      <>
        <StatusBadge status="In stock" />
        <StatusBadge status="Low stock" />
        <StatusBadge status="Out of stock" />
      </>,
    );
    expect(screen.getByText("In stock")).toBeInTheDocument();
    expect(screen.getByText("Low stock")).toBeInTheDocument();
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("renders delete confirmation and invokes its actions", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ProductDeleteModal
        isOpen
        onClose={onClose}
        activeProduct={product}
        onConfirm={onConfirm}
        isDeleting={false}
      />,
    );
    expect(screen.getByText(/delete this product/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("renders product columns and dispatches row actions", () => {
    const methods = {
      viewDetails: vi.fn(),
      openEdit: vi.fn(),
      setActiveProduct: vi.fn(),
      setIsDeleteOpen: vi.fn(),
    };
    const columns = getProductsColumns(methods);
    render(
      <MemoryRouter>
        <>
          {columns.map((column, index) => (
            <div key={index}>
              {"cell" in column && column.cell
                ? column.cell({ row: { original: product } })
                : null}
            </div>
          ))}
        </>
      </MemoryRouter>,
    );
    expect(screen.getByText("$2.50")).toBeInTheDocument();
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View details" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit item" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete item" }));
    expect(methods.viewDetails).toHaveBeenCalledWith("apple");
    expect(methods.openEdit).toHaveBeenCalledWith(product);
    expect(methods.setActiveProduct).toHaveBeenCalledWith(product);
    expect(methods.setIsDeleteOpen).toHaveBeenCalledWith(true);
  });
});
