import { useState, useMemo } from "react";
import { Plus, ChevronDown, Layers } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";
import { useGetCategories } from "../hooks/useGetCategories";
import { CategoryCard } from "../components/CategoryCard";
import CreateCategorySheet from "../components/CreateCategorySheet";
import EditCategorySheet from "../components/EditCategorySheet";
import DeleteCategoryDialog from "../components/DeleteCategoryDialog";
import type { Category } from "../types/categories.types";

export default function CategoriesListPage() {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    undefined,
  );
  const [accumulatedCategories, setAccumulatedCategories] = useState<
    Category[]
  >([]);

  // States for Edit and Delete modals
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 1. Fetch Categories Query
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetCategories({
    limit: 8,
    cursor: currentCursor,
  });

  const pagination = response?.data?.pagination;
  const nextCursor = pagination?.nextCursor;
  const hasNext = pagination?.hasNext ?? false;

  // 2. Accumulate Categories across pages safely
  const allCategories = useMemo(() => {
    const freshData = response?.data?.data ?? [];
    if (!currentCursor) {
      return freshData;
    }
    const existingSlugs = new Set(accumulatedCategories.map((c) => c.slug));
    const newUnique = freshData.filter((c) => !existingSlugs.has(c.slug));
    return [...accumulatedCategories, ...newUnique];
  }, [response, currentCursor, accumulatedCategories]);

  const handleLoadMore = () => {
    if (nextCursor) {
      setAccumulatedCategories(allCategories);
      setCurrentCursor(nextCursor);
    }
  };

  const handleEdit = (category: Category) => {
    setActiveCategory(category);
    setIsEditSheetOpen(true);
  };

  const handleDelete = (category: Category) => {
    setActiveCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 space-y-8 pb-8 pt-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Typography
            variant="h1"
            className="text-2xl md:text-3xl font-bold text-sidebar-bg"
          >
            Categories
          </Typography>
          <Typography variant="muted" className="text-sm text-text-secondary">
            View and manage product categories
          </Typography>
        </div>

        {/* Primary CTA Button */}
        <Button
          variant="primary"
          size="default"
          onClick={() => setIsCreateSheetOpen(true)}
          className="font-semibold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add category</span>
        </Button>
      </div>

      {/* Main Content Grid */}
      {isLoading && !currentCursor ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl border border-border p-5 h-64 animate-pulse flex flex-col justify-between"
            >
              <div className="w-full h-36 bg-surface-soft rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-surface-soft rounded w-3/4" />
                <div className="h-3 bg-surface-soft rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : allCategories.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-surface-mint text-brand-primary flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <Typography
            variant="h2"
            className="text-lg font-bold text-sidebar-bg"
          >
            No categories yet
          </Typography>
          <Typography variant="muted" className="text-sm text-text-secondary">
            Get started by creating your first product category.
          </Typography>
          <div className="pt-2">
            <Button
              variant="primary"
              size="default"
              onClick={() => setIsCreateSheetOpen(true)}
              className="font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Create category</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allCategories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border select-none">
            <Typography variant="muted" className="text-xs text-text-secondary">
              Showing {allCategories.length} categories
            </Typography>

            {hasNext && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isFetching}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border bg-card text-xs font-semibold text-sidebar-bg hover:bg-surface-soft hover:border-brand-primary/40 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <span>
                  {isFetching ? "Loading..." : "Load more categories"}
                </span>
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </button>
            )}
          </div>
        </>
      )}

      {/* Create Sheet */}
      <CreateCategorySheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
      />

      {/* Edit and Delete Modals for the individual cards */}
      {activeCategory && (
        <>
          <EditCategorySheet
            isOpen={isEditSheetOpen}
            onClose={() => {
              setIsEditSheetOpen(false);
              setTimeout(() => setActiveCategory(null), 300);
            }}
            category={activeCategory}
          />
          <DeleteCategoryDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setTimeout(() => setActiveCategory(null), 300);
            }}
            category={activeCategory}
          />
        </>
      )}
    </div>
  );
}
