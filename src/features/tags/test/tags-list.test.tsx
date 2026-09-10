import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TagListPage from "../pages/TagListPage";
import { useTagsPage } from "../hooks/useTagsPage";

vi.mock("../hooks/useTagsPage", () => ({ useTagsPage: vi.fn() }));

const methods = {
  activeTag: null,
  deleteTag: vi.fn(),
  handleFormSubmit: vi.fn(),
  handlePageChange: vi.fn(),
  handlePageSizeChange: vi.fn(),
  isCreating: false,
  isDeleteOpen: false,
  isDeleting: false,
  isError: false,
  isLoading: false,
  isSheetOpen: false,
  isUpdating: false,
  openCreate: vi.fn(),
  openEdit: vi.fn(),
  page: 1,
  pageSize: 10,
  refetch: vi.fn(),
  setActiveTag: vi.fn(),
  setIsDeleteOpen: vi.fn(),
  setIsSheetOpen: vi.fn(),
  tags: [{ name: "Organic", slug: "organic" }],
  totalCount: 1,
  totalPages: 1,
};

describe("TagListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTagsPage).mockReturnValue(
      methods as ReturnType<typeof useTagsPage>,
    );
  });
  it("renders tags and dispatches create, edit, and delete actions", () => {
    render(<TagListPage />);
    expect(screen.getByText("1 tags")).toBeInTheDocument();
    expect(screen.getByText("Organic")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Create tag/i }));
    fireEvent.click(screen.getByRole("button", { name: "Edit item" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete item" }));
    expect(methods.openCreate).toHaveBeenCalledOnce();
    expect(methods.openEdit).toHaveBeenCalledWith(methods.tags[0]);
    expect(methods.setActiveTag).toHaveBeenCalledWith(methods.tags[0]);
    expect(methods.setIsDeleteOpen).toHaveBeenCalledWith(true);
  });
  it("renders an error and retries", () => {
    vi.mocked(useTagsPage).mockReturnValue({
      ...methods,
      isError: true,
    } as ReturnType<typeof useTagsPage>);
    render(<TagListPage />);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(methods.refetch).toHaveBeenCalledOnce();
  });
});
