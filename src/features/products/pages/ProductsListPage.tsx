import {
  Plus,
  Package as PackageIcon,
  Search,
  FilterX,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import PaginationBar from "@/components/ui/pagination";

import type { Product } from "../products.types";
import { useProductsPage } from "../hooks/useProductsPage";
import { ProductFormSheet } from "../components/ProductFormSheet";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import AppTable from "@/components/ui/AppTable";
import PageHeader from "@/components/ui/shared/page-header";
import { getImageUrl } from "@/lib/utils";

export default function ProductsListPage() {
  const hook = useProductsPage();

  const columns = [
    {
      accessorKey: "productImageUrl",
      header: "IMAGE",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original;
        const productName = p.name?.trim() ? p.name : p.slug;
        const imageUrl = getImageUrl(p.productImageUrl, p.updatedAt);

        return (
          <div className="flex items-center justify-center py-1">
            <div className="w-10 h-10 rounded-lg bg-surface-soft border border-border-input overflow-hidden flex items-center justify-center shrink-0">
              {p.productImageUrl ? (
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
        const p = row.original;
        const productName = p.name?.trim() ? p.name : p.slug;
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
        const p = row.original;
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
        const p = row.original;
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
        const p = row.original;
        const stockQuantity = p.stockQuantity ?? 0;

        // LABEL OUT OF STOCK
        if (stockQuantity <= 0) {
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-status-danger-bg text-xs font-medium text-status-danger-text uppercase tracking-wider whitespace-nowrap">
              Out of stock
            </span>
          );
        }

        // REGULAR STOCK COUNT
        const isLowStock = stockQuantity < 10;
        return (
          <Typography
            variant="body"
            className={`font-semibold ${isLowStock ? "text-status-danger-text" : "text-sidebar-bg"}`}
          >
            {stockQuantity} {stockQuantity === 1 ? "unit" : "units"}
          </Typography>
        );
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }: { row: { original: Product } }) => {
        const p = row.original;
        return (
          <div className="flex items-center justify-center">
            <button
              type="button"
              aria-label="View details"
              onClick={() => hook.viewDetails(p.slug)}
              className="text-text-secondary hover:text-sidebar-bg transition-colors p-1.5 cursor-pointer rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
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

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-border-input shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
          <input
            type="text"
            placeholder="Search products..."
            value={hook.filters.Search}
            onChange={(e) => hook.handleFilterChange("Search", e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg border border-border-input text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 flex-1">
          <select
            value={hook.filters.CategorySlug || ""}
            onChange={(e) =>
              hook.handleFilterChange("CategorySlug", e.target.value)
            }
            className="h-10 px-3 rounded-lg border border-border-input text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-35 flex-1"
          >
            <option value="">All Categories</option>
            {hook.categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={
              hook.filters.InStock === ""
                ? ""
                : hook.filters.InStock?.toString()
            }
            onChange={(e) => {
              const val = e.target.value;
              let stockVal: boolean | "" = "";
              if (val === "true") stockVal = true;
              if (val === "false") stockVal = false;
              hook.handleFilterChange("InStock", stockVal);
            }}
            className="h-10 px-3 rounded-lg border border-border-input text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-30 flex-1"
          >
            <option value="">All Stock</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>

          <select
            value={`${hook.filters.SortBy || ""}-${hook.filters.SortDir || ""}`}
            onChange={(e) => {
              const [sortBy, sortDir] = e.target.value.split("-");
              hook.handleFilterChange("SortBy", sortBy || "");
              hook.handleFilterChange("SortDir", sortDir || "");
            }}
            className="h-10 px-3 rounded-lg border border-border-input text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-37.5 flex-1"
          >
            <option value="-">Sort by...</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>

          <button
            onClick={hook.clearFilters}
            className="h-10 px-3 flex items-center justify-center rounded-lg border border-border-input text-text-secondary hover:bg-surface-soft hover:text-status-danger-text transition-colors shrink-0"
            title="Clear Filters"
          >
            <FilterX className="w-4 h-4" />
          </button>
        </div>
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
          emptyMessage="No products found matching your filters."
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
      />
      <ProductDeleteModal
        isOpen={hook.isDeleteOpen}
        onClose={() => hook.setIsDeleteOpen(false)}
        activeProduct={hook.activeProduct}
        onConfirm={() => {
          if (hook.activeProduct) {
            hook.deleteProduct(hook.activeProduct.slug);
          }
        }}
        isDeleting={hook.isDeleting}
      />
    </div>
  );
}
