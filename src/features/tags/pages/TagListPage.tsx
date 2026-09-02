import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import DataTable from "@/components/ui/table";

import type { Tag } from "@/features/tags/types/tags.types";
import { useTagsPage } from "../hooks/useTagsPage";
import { TagFormModal } from "../components/TagFormModal";
import { TagDeleteModal } from "../components/TagDeleteModal";

export default function TagListPage() {
  const tagHook = useTagsPage();

  return (
    <div className="w-full max-w-350 mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant="h1" className="text-2xl font-bold text-sidebar-bg">
            Tags
          </Typography>
          <Typography variant="body" className="text-sm text-text-secondary mt-0.5">
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
          <Button variant="outline" onClick={() => tagHook.refetch()} className="ml-4">
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
                    <Typography variant="body" className="font-semibold text-sidebar-bg">
                      {t.name}
                    </Typography>
                  </div>
                );
              }
              if (key === "slug") {
                return (
                  <Typography variant="body" className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-soft text-xs font-medium text-text-secondary">
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

      <TagFormModal
        isOpen={tagHook.isSheetOpen}
        onClose={() => tagHook.setIsSheetOpen(false)}
        activeTag={tagHook.activeTag}
        onSubmit={tagHook.handleFormSubmit}
        isSubmitting={tagHook.isCreating || tagHook.isUpdating}
      />

      <TagDeleteModal
        isOpen={tagHook.isDeleteOpen}
        onClose={() => tagHook.setIsDeleteOpen(false)}
        activeTag={tagHook.activeTag}
        onConfirm={() => {
          if (tagHook.activeTag) {
            tagHook.deleteTag(tagHook.activeTag.slug);
          }
        }}
        isDeleting={tagHook.isDeleting}
      />
    </div>
  );
}