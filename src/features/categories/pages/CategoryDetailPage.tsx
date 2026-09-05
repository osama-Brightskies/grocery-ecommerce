import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Layers } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetCategoryDetail } from "../hooks/useGetCategoryDetail";
import { useGetCategoryProducts } from "../hooks/useGetCategoryProducts";
import { CategoryProductsTable } from "../components/CategoryProductsTable";
import EditCategorySheet from "../components/EditCategorySheet";
import DeleteCategoryDialog from "../components/DeleteCategoryDialog";
import { getImageUrl, formatDate } from "@/lib/utils";
import type { CategoryProduct } from "../types/categories.types";

export default function CategoryDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [productCursor, setProductCursor] = useState<string | undefined>(
    undefined,
  );
  const [accumulatedProducts, setAccumulatedProducts] = useState<
    CategoryProduct[]
  >([]);

  // 1. Fetch Category Detail
  const {
    data: categoryResponse,
    isLoading: isCategoryLoading,
    isError,
  } = useGetCategoryDetail(slug);

  // 2. Fetch Category Products
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isFetching: isFetchingMoreProducts,
  } = useGetCategoryProducts(slug, {
    limit: 5,
    cursor: productCursor,
  });

  const category = categoryResponse?.data;
  const productsPagination = productsResponse?.data?.pagination;
  const hasNextProducts = productsPagination?.hasNext ?? false;
  const nextProductCursor = productsPagination?.nextCursor;

  // Accumulate products for "Load more"
  const allProducts = useMemo(() => {
    const freshData = productsResponse?.data?.data ?? [];
    if (!productCursor) return freshData;

    const existingSlugs = new Set(accumulatedProducts.map((p) => p.slug));
    const newUnique = freshData.filter((p) => !existingSlugs.has(p.slug));
    return [...accumulatedProducts, ...newUnique];
  }, [productsResponse, productCursor, accumulatedProducts]);

  const handleLoadMoreProducts = () => {
    if (nextProductCursor) {
      setAccumulatedProducts(allProducts);
      setProductCursor(nextProductCursor);
    }
  };

  // Loading State
  if (isCategoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <Typography variant="muted">Loading category details...</Typography>
        </div>
      </div>
    );
  }

  // 404 Not Found State
  if (isError || !category) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-12">
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <Typography variant="body" className="font-medium text-inherit">
            Back to Categories
          </Typography>
        </button>

        <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-status-danger-bg text-status-danger-text flex items-center justify-center mx-auto mb-2">
            <Layers className="w-7 h-7" />
          </div>
          <Typography
            variant="h2"
            className="text-xl font-bold text-sidebar-bg"
          >
            Category not found
          </Typography>
          <Typography
            variant="muted"
            className="text-sm text-text-secondary max-w-md mx-auto"
          >
            The category &quot;{slug}&quot; does not exist or may have been
            deleted.
          </Typography>
          <div className="pt-4 flex justify-center">
            <Button
              variant="primary"
              size="default"
              onClick={() => navigate("/categories")}
              className="cursor-pointer font-semibold shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Return to Categories</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Top Back Navigation & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <Typography variant="body" className="font-medium text-inherit">
            Categories
          </Typography>
        </button>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Button
            variant="outline"
            size="default"
            onClick={() => setIsEditOpen(true)}
            className="border-border hover:border-brand-primary text-sidebar-bg font-semibold cursor-pointer"
          >
            <Pencil className="w-4 h-4 mr-1.5" />
            <span>Edit category</span>
          </Button>

          <Button
            variant="danger"
            size="default"
            onClick={() => setIsDeleteOpen(true)}
            className="font-semibold cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            <span>Delete category</span>
          </Button>
        </div>
      </div>

      {/* Category Overview Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-32 h-32 rounded-xl bg-surface-soft border border-border/80 p-3 flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={getImageUrl(category.imageUrl)}
            alt={category.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Typography
              variant="h1"
              className="text-2xl md:text-3xl font-bold text-sidebar-bg"
            >
              {category.name}
            </Typography>

            <Badge
              variant="primary"
              className="self-center sm:self-auto font-mono text-xs"
            >
              {allProducts.length}{" "}
              {allProducts.length === 1 ? "Product" : "Products"}
            </Badge>
          </div>

          <Typography
            variant="muted"
            className="text-sm font-mono text-text-secondary"
          >
            {category.slug}
          </Typography>

          <Typography
            variant="muted"
            className="text-xs text-text-secondary pt-1"
          >
            Created {formatDate(category.createdAt)}
          </Typography>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        <Typography variant="h2" className="text-lg font-bold text-sidebar-bg">
          Products in this category
        </Typography>

        <CategoryProductsTable
          products={allProducts}
          isLoading={isProductsLoading && !productCursor}
          hasNext={hasNextProducts}
          isFetchingMore={isFetchingMoreProducts}
          onLoadMore={handleLoadMoreProducts}
        />
      </div>

      {/* Edit Category Slide-over Sheet */}
      <EditCategorySheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        category={category}
      />

      {/* Delete Confirmation & Success Dialogs */}
      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        category={category}
        productsCount={allProducts.length}
      />
    </div>
  );
}
