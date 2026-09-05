import { Edit2, Plus, Trash2, Eye, Package as PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import PaginationBar from "@/components/ui/pagination";

import type { Product } from "../types/products.types";
import { useProductsPage } from "../hooks/useProductsPage";
import { ProductFormSheet } from "../components/ProductFormSheet";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import AppTable from "@/components/ui/AppTable";
import PageHeader from "@/components/ui/shared/page-header";

export default function ProductsListPage() {
  const hook = useProductsPage();

  const columns = [
    {
      accessorKey: "productImageUrl",
      header: "IMAGE",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original as Product & { name?: string; slug: string };
        const productName =
          typeof p.name === "string" && p.name.trim() ? p.name : p.slug;

        const imagePath =
          "productImageUrl" in p && typeof p.productImageUrl === "string"
            ? p.productImageUrl
            : undefined;
        const normalizedPath = imagePath
          ?.replace(/\\/g, "/")
          .replace(/^\/+/, "");
        const s3BaseUrl =
          "https://ecommerce-interns-bucket.s3.eu-central-1.amazonaws.com";
        const imageUrl = normalizedPath
          ? `${s3BaseUrl}/${normalizedPath}`
          : undefined;

        return (
          <div className="flex items-center justify-center py-1">
            <div className="w-10 h-10 rounded-lg bg-surface-soft border border-border-input overflow-hidden flex items-center justify-center shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={productName}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              ) : (
                <PackageIcon className="w-5 h-5 text-text-subtle" />
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "PRODUCT INFO",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original as Product & { name?: string; slug: string };
        const productName =
          typeof p.name === "string" && p.name.trim() ? p.name : p.slug;
        return (
          <div className="flex flex-col items-center text-center justify-center py-1 w-full max-w-62.5 mx-auto">
            <Typography
              variant="body"
              className="font-semibold text-sidebar-bg truncate w-full"
            >
              {productName}
            </Typography>
            <Typography variant="muted" className="text-xs truncate w-full">
              Slug: {p.slug}
            </Typography>
          </div>
        );
      },
    },
    {
      accessorKey: "categorySlug",
      header: "CATEGORY",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original as Product & { categorySlug?: string };
        return (
          <Typography
            variant="body"
            className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-mint text-xs font-medium text-brand-primary uppercase tracking-wider"
          >
            {p.categorySlug ?? "—"}
          </Typography>
        );
      },
    },
    {
      accessorKey: "price",
      header: "PRICE",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original as Product & { price?: number };
        return (
          <Typography variant="body" className="font-bold text-sidebar-bg">
            {typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "—"}
          </Typography>
        );
      },
    },
    {
      accessorKey: "stockQuantity",
      header: "STOCK",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original as Product & { stockQuantity?: number };
        const stockQuantity = p.stockQuantity ?? 0;
        const isLowStock = stockQuantity < 10;
        return (
          <Typography
            variant="body"
            className={`font-semibold ${isLowStock ? "text-status-danger-text" : "text-sidebar-bg"}`}
          >
            {stockQuantity}
          </Typography>
        );
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original as Product & { slug: string };
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="View details"
              onClick={() => hook.viewDetails(p.slug)}
              className="text-brand-primary hover:text-brand-medium transition-colors p-1 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Edit item"
              onClick={() => hook.openEdit(p)}
              className="text-emerald-700 hover:text-emerald-900 transition-colors p-1 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Delete item"
              onClick={() => {
                hook.setActiveProduct(p);
                hook.setIsDeleteOpen(true);
              }}
              className="text-red-600 hover:text-red-800 transition-colors p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Products" description="Manage your catalog" />
        <Button
          variant="primary"
          onClick={hook.openCreate}
          className="h-11 px-5 bg-brand-primary hover:opacity-90 text-white font-semibold shadow-sm rounded-lg flex items-center shrink-0 mt-1"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>
      {hook.isError ? (
        <div className="p-12 text-center text-status-danger-text bg-white rounded-xl border border-border-input shadow-xs">
          <Typography variant="body" className="inline">
            Failed to load products.
          </Typography>
          <Button
            variant="outline"
            onClick={() => hook.refetch()}
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      ) : (
        <AppTable
          data={hook.products}
          columns={columns}
          isLoading={hook.isLoading}
          emptyMessage="No products yet - create your first one."
          paginationBar={
            <PaginationBar
              currentPage={hook.page}
              totalPages={hook.totalPages}
              onPageChange={hook.handlePageChange}
              pageSize={hook.pageSize}
              onPageSizeChange={hook.handlePageSizeChange}
              showPageSizeSelect={true}
              isCurrentPaginationInfoVisible={false}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          }
        />
      )}
      <ProductFormSheet
        isOpen={hook.isSheetOpen}
        onClose={() => hook.setIsSheetOpen(false)}
        activeProduct={hook.activeProduct}
        onSubmit={hook.handleFormSubmit}
        isSubmitting={hook.isCreating || hook.isUpdating}
        categoryOptions={hook.categoryOptions}
        availableTags={hook.availableTags}
      />{" "}
      <ProductDeleteModal
        isOpen={hook.isDeleteOpen}
        onClose={() => hook.setIsDeleteOpen(false)}
        activeProduct={hook.activeProduct}
        onConfirm={() => {
          if (hook.activeProduct) {
            hook.deleteProduct(
              (hook.activeProduct as Product & { slug: string }).slug,
            );
          }
        }}
        isDeleting={hook.isDeleting}
      />
    </div>
  );
}
