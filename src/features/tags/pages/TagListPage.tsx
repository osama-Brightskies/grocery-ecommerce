import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";

import type { Tag } from "@/features/tags/types/tags.types";
import { useTagsPage } from "../hooks/useTagsPage";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import DataTable from "@/components/ui/table";

export default function TagListPage() {
  const tagHook = useTagsPage();

  return (
    <div className="w-full max-w-350 mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography
            variant="h1"
            className="text-2xl font-bold text-sidebar-bg"
          >
            Tags
          </Typography>
          <Typography
            variant="body"
            className="text-sm text-text-secondary mt-0.5"
          >
            Manage your product tags
          </Typography>
        </div>
        <Button
          variant="primary"
          onClick={tagHook.openCreate}
          className="h-11 px-5 bg-brand-primary hover:opacity-90 text-white font-semibold shadow-sm rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Create tag
        </Button>
      </div>

      {tagHook.isError ? (
        <div className="p-12 text-center text-red-500 bg-white rounded-xl border border-border-input">
          <Typography variant="body" className="inline">
            Failed to load tags.
          </Typography>
          <Button
            variant="outline"
            onClick={() => tagHook.refetch()}
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-input shadow-xs overflow-hidden">
          <DataTable
            data={tagHook.tags.map((tag) => ({ ...tag, id: tag.slug }))}
            columns={[
              { key: "name", header: "NAME" },
              { key: "slug", header: "SLUG" },
              { key: "actions", header: "ACTIONS" },
            ]}
            isLoading={tagHook.isLoading}
            renderCell={(key: string, t: Tag) => {
              if (key === "name") {
                return (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-lg bg-surface-soft flex items-center justify-center font-semibold text-sidebar-bg text-sm">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <Typography
                      variant="body"
                      className="font-semibold text-sidebar-bg"
                    >
                      {t.name}
                    </Typography>
                  </div>
                );
              }
              if (key === "slug") {
                return (
                  <Typography
                    variant="body"
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-soft text-xs font-medium text-text-secondary"
                  >
                    {t.slug}
                  </Typography>
                );
              }
              if (key === "actions") {
                return (
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      aria-label="Edit item"
                      onClick={() => tagHook.openEdit(t)}
                      className="text-emerald-700 hover:text-emerald-900 transition-colors p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete item"
                      onClick={() => {
                        tagHook.setActiveTag(t);
                        tagHook.setIsDeleteOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              }
              return null;
            }}
            paginationBar={
              <Pagination
                currentPage={tagHook.page}
                totalPages={tagHook.totalPages}
                onPageChange={tagHook.handlePageChange}
              />
            }
          />
        </div>
      )}

      {tagHook.isSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-border-input animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-border-input">
                <div className="space-y-1">
                  <Typography
                    variant="h3"
                    className="font-bold text-sidebar-bg"
                  >
                    {tagHook.activeTag ? "Edit Tag" : "Create Tag"}
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-sm text-text-secondary"
                  >
                    {tagHook.activeTag
                      ? "Update the tag details below."
                      : "Add a new tag for your products."}
                  </Typography>
                </div>
                <button
                  type="button"
                  onClick={() => tagHook.setIsSheetOpen(false)}
                  disabled={tagHook.isCreating || tagHook.isUpdating}
                  className="rounded-full w-8 h-8 flex items-center justify-center border border-border-input text-text-secondary hover:text-sidebar-bg hover:bg-surface-soft transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                id="tag-popup-form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-sidebar-bg uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={tagHook.activeTag?.name || ""}
                    className="w-full h-10 px-3 rounded-lg border border-border-input text-sm text-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter tag name"
                  />
                </div>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-border-input">
              <Button
                variant="outline"
                onClick={() => tagHook.setIsSheetOpen(false)}
                disabled={tagHook.isCreating || tagHook.isUpdating}
                className="h-11 border-border-input text-sidebar-bg hover:bg-surface-soft font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const form = document.getElementById(
                    "tag-popup-form",
                  ) as HTMLFormElement;
                  if (form) {
                    const formData = new FormData(form);
                    tagHook.handleFormSubmit({
                      name: (formData.get("name") as string) || "",
                      description:
                        (formData.get("description") as string) || undefined,
                    });
                  }
                }}
                disabled={tagHook.isCreating || tagHook.isUpdating}
                className="h-11 font-semibold bg-brand-primary text-white"
              >
                {tagHook.isCreating || tagHook.isUpdating
                  ? "Saving..."
                  : "Save Tag"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {tagHook.isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-border-input animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-border-input">
                <div className="space-y-1">
                  <Typography
                    variant="h3"
                    className="font-bold text-sidebar-bg"
                  >
                    Delete Tag?
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-sm text-text-secondary"
                  >
                    This action cannot be undone.
                  </Typography>
                </div>
                <button
                  type="button"
                  onClick={() => tagHook.setIsDeleteOpen(false)}
                  disabled={tagHook.isDeleting}
                  className="rounded-full w-8 h-8 flex items-center justify-center border border-border-input text-text-secondary hover:text-sidebar-bg hover:bg-surface-soft transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <Typography
                  variant="body"
                  className="text-sm text-text-secondary"
                >
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-sidebar-bg">
                    {tagHook.activeTag?.name}
                  </span>
                  ? This will permanently remove it from the system.
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-border-input">
              <Button
                variant="outline"
                onClick={() => tagHook.setIsDeleteOpen(false)}
                disabled={tagHook.isDeleting}
                className="h-11 border-border-input text-sidebar-bg hover:bg-surface-soft font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (tagHook.activeTag) {
                    tagHook.deleteTag(tagHook.activeTag.slug);
                  }
                }}
                disabled={tagHook.isDeleting}
                className="h-11 font-semibold"
              >
                {tagHook.isDeleting ? "Deleting..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
