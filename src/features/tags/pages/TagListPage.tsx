import { Edit2, Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import PaginationBar from "@/components/ui/pagination";

import type { Tag } from "@/features/tags/types/tags.types";
import { useTagsPage } from "../hooks/useTagsPage";
import PageHeader from "@/components/ui/shared/page-header";
import AppTable from "@/components/ui/AppTable";
import { TagFormModal } from "../components/TagFormModal";
import { TagDeleteModal } from "../components/TagDeleteModal";

export default function TagListPage() {
  const {
    activeTag,
    deleteTag,
    handleFormSubmit,
    handlePageChange,
    handlePageSizeChange,
    isCreating,
    isDeleteOpen,
    isDeleting,
    isError,
    isLoading,
    isSheetOpen,
    isUpdating,
    openCreate,
    openEdit,
    page,
    pageSize,
    refetch,
    setActiveTag,
    setIsDeleteOpen,
    setIsSheetOpen,
    tags,
    totalCount,
    totalPages,
  } = useTagsPage();

  const columns = [
    {
      accessorKey: "name",
      header: "NAME",
      cell: (props: { row: { original: Tag } }) => {
        const t = props.row.original;
        return (
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="w-8 h-8 rounded-lg bg-surface-soft flex items-center justify-center font-semibold text-sidebar-bg text-sm shrink-0">
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
      },
    },
    {
      accessorKey: "slug",
      header: "SLUG",
      cell: (props: { row: { original: Tag } }) => {
        const t = props.row.original;
        return (
          <Typography
            variant="body"
            className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-soft text-xs font-medium text-text-secondary"
          >
            {t.slug}
          </Typography>
        );
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: (props: { row: { original: Tag } }) => {
        const t = props.row.original;
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Edit item"
              onClick={() => openEdit(t)}
              className="text-emerald-700 hover:text-emerald-900 transition-colors p-1"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Delete item"
              onClick={() => {
                setActiveTag(t);
                setIsDeleteOpen(true);
              }}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-350 mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-3">
          <PageHeader title="Tags" description="Manage your product tags" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-border-input rounded-lg shadow-xs text-brand-primary text-sm font-semibold">
            <TagIcon className="w-4 h-4" />
            <span>{totalCount} tags</span>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={openCreate}
          className="h-11 px-5 bg-brand-primary hover:opacity-90 text-white font-semibold shadow-sm rounded-lg flex items-center shrink-0 mt-1"
        >
          <Plus className="w-4 h-4 mr-2" /> Create tag
        </Button>
      </div>

      {isError ? (
        <div className="p-12 text-center text-red-500 bg-white rounded-xl border border-border-input shadow-xs">
          <Typography variant="body" className="inline">
            Failed to load tags.
          </Typography>
          <Button variant="outline" onClick={() => refetch()} className="ml-4">
            Retry
          </Button>
        </div>
      ) : (
        <AppTable
          data={tags}
          columns={columns}
          isLoading={isLoading}
          paginationBar={
            <PaginationBar
              currentPage={page}
              totalPages={totalPages!}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              totalCount={totalCount}
            />
          }
        />
      )}

      <TagFormModal
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        activeTag={activeTag}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <TagDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        activeTag={activeTag}
        onConfirm={() => {
          deleteTag(activeTag!.slug);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
