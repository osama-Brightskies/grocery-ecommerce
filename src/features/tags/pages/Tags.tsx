import * as React from "react";
import { Pagination } from "@/components/ui/pagination";
import PageHeader from "@/components/ui/shared/page-header";
import { Pencil, Trash2, Plus, Tag as TagIcon } from "lucide-react";
import {
  fetchTagsPaginated,
  createTag,
  updateTag,
  deleteTag,
} from "../../../api/tags.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import DataTable from "@/components/ui/table";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function Tags() {
  const [data, setData] = React.useState<Tag[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  const [tagToDelete, setTagToDelete] = React.useState<Tag | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [tagToEdit, setTagToEdit] = React.useState<Tag | null>(null);
  const [formData, setFormData] = React.useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const PAGE_SIZE = 5;

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    fetchTagsPaginated(currentPage, PAGE_SIZE)
      .then((res) => {
        setData(res.data || []);
        setTotalCount(res.total || 0);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tags:", err);
        setData([]);
        setIsLoading(false);
      });
  }, [currentPage]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(loadData, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const handleConfirmDelete = async () => {
    const targetSlug = tagToDelete?.slug;
    if (!targetSlug) return;
    try {
      await deleteTag(targetSlug);
      setTagToDelete(null);
      loadData();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const openCreateModal = () => {
    setTagToEdit(null);
    setFormData({ name: "" });
    setIsFormOpen(true);
  };

  const openEditModal = (tag: Tag) => {
    setTagToEdit(tag);
    setFormData({ name: tag.name });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (tagToEdit) {
        await updateTag(tagToEdit.slug, formData.name);
      } else {
        await createTag(formData.name);
      }
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to save tag. Check authentication or duplicate names.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const showingStart = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(currentPage * PAGE_SIZE, totalCount);

  const columns = [
    { key: "name", header: "Tag Name" },
    { key: "slug", header: "Slug" },
    { key: "actions", header: "Actions" },
  ];

  const renderCell = (key: string, item: Tag) => {
    if (key === "name") {
      return (
        <span className="font-bold text-foreground tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary/40"></span>
          {item.name}
        </span>
      );
    }
    if (key === "slug") {
      return (
        <span className="text-muted-foreground font-mono text-xs bg-muted/50 px-2 py-1 rounded w-fit inline-block">
          {item.slug}
        </span>
      );
    }
    if (key === "actions") {
      return (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => openEditModal(item)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
            title="Edit Tag"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTagToDelete(item)}
            className="text-destructive hover:text-destructive/80 transition-colors cursor-pointer p-1"
            title="Delete Tag"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Tags"
          description="Organize your products with custom tags"
        />
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create tag
        </button>
      </div>

      <div className="flex justify-between items-end pr-2 text-xs text-muted-foreground font-medium mt-8 mb-2">
        <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border">
          <TagIcon className="w-4 h-4" />
          <span>
            Total Tags: <strong>{totalCount}</strong>
          </span>
        </div>
        <span>
          Showing {showingStart}–{showingEnd} of {totalCount}
        </span>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        renderCell={renderCell}
        paginationBar={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        }
      />

      <Dialog
        open={!!tagToDelete}
        onOpenChange={(open) => !open && setTagToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete tag?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag{" "}
              <span className="font-semibold text-foreground">
                {tagToDelete?.name}
              </span>
              ? Products using this tag may be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 sm:justify-end">
            <button
              onClick={() => setTagToDelete(null)}
              className="px-4 py-2 bg-transparent border border-input text-sm font-semibold rounded-lg hover:bg-accent cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-destructive text-destructive-foreground text-sm font-semibold rounded-lg hover:opacity-90 cursor-pointer"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {tagToEdit ? "Edit Tag" : "Create New Tag"}
            </DialogTitle>
            <DialogDescription>
              {tagToEdit
                ? "Modify the name of the existing tag."
                : "Add a new tag to organize your products."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Tag Name *
              </label>
              <input
                required
                autoFocus
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                placeholder="e.g. Gluten Free"
              />
            </div>
            <DialogFooter className="flex justify-end gap-3 sm:justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-transparent border border-input text-sm font-semibold rounded-lg hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSubmitting ? "Saving..." : "Save Tag"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
