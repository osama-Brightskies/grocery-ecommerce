import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@/components/ui/shared/Typography";
import { useGetCategoryDetail } from "../hooks/useGetCategoryDetail";
import { useGetCategoryProducts } from "../hooks/useGetCategoryProducts";
import { CategoryDetailHeader } from "../components/CategoryDetailHeader";
import { CategoryHeaderCard } from "../components/CategoryHeaderCard";
import { CategoryProductsTable } from "../components/CategoryProductsTable";
import { CategoryNotFoundState } from "../components/CategoryNotFoundState";
import EditCategorySheet from "../components/EditCategorySheet";
import DeleteCategoryDialog from "../components/DeleteCategoryDialog";
import type { CategoryProduct } from "../types/categories.types";

export default function CategoryDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();

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

  // Accumulate products for cursor-based "Load more"
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
    return <CategoryNotFoundState slug={slug} />;
  }

  return (
    <div className="space-y-8 w-full pb-16">
      {/* 1. Top Navigation & Action Buttons */}
      <CategoryDetailHeader
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* 2. Overview Card */}
      <CategoryHeaderCard
        category={category}
        productsCount={allProducts.length}
      />

      {/* 3. Products Section */}
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

      {/* 4. Edit Slide-over Sheet */}
      <EditCategorySheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        category={category}
      />

      {/* 5. Delete Confirmation Dialogs */}
      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        category={category}
        productsCount={allProducts.length}
      />
    </div>
  );
}
