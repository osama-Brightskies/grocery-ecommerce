import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TagDeleteModal } from "../components/TagDeleteModal";
import { TagFormModal } from "../components/TagFormModal";

const tag = { name: "Organic", slug: "organic" };

describe("tag components", () => {
  it("creates and edits tags", async () => {
    const onSubmit = vi.fn();
    const view = render(
      <TagFormModal
        isOpen
        onClose={vi.fn()}
        activeTag={null}
        onSubmit={onSubmit}
        isSubmitting={false}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText("Enter tag name"), {
      target: { value: "Fresh" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Tag" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { name: "Fresh", description: "" },
        expect.anything(),
      ),
    );
    view.rerender(
      <TagFormModal
        isOpen
        onClose={vi.fn()}
        activeTag={tag}
        onSubmit={onSubmit}
        isSubmitting={false}
      />,
    );
    expect(screen.getByDisplayValue("Organic")).toBeInTheDocument();
    expect(screen.getByText("Edit Tag")).toBeInTheDocument();
  });

  it("confirms and cancels tag deletion", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <TagDeleteModal
        isOpen
        onClose={onClose}
        activeTag={tag}
        onConfirm={onConfirm}
        isDeleting={false}
      />,
    );
    expect(screen.getByText("Organic")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
