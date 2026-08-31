import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CategoryCard from "../components/category-card";

describe("CategoryCard", () => {
  it("renders category details and handles actions", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CategoryCard
        name="Fresh Produce"
        productCount="12 products"
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByTestId("category-card")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByText("12 products")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("category-edit-button"));
    fireEvent.click(screen.getByTestId("category-delete-button"));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("renders an empty initial when the category has no name", () => {
    render(
      <CategoryCard
        name=""
        productCount="0 products"
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("category-card")).toBeInTheDocument();
    expect(screen.getByTestId("category-card").firstElementChild).toHaveTextContent(
      "0 products",
    );
  });
});
