import { Plus, Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import PaginationBar from "@/components/ui/pagination";

import { useProductsPage } from "../hooks/useProductsPage";
import { ProductFormSheet } from "../components/ProductFormSheet";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import AppTable from "@/components/ui/AppTable";
import PageHeader from "@/components/ui/shared/page-header";
import { AppSelect } from "@/components/ui/AppSelect";
import { getProductsColumns } from "../types/products.columns";
import { useMemo } from "react";

export default function ProductsListPage() {
  const productsMethods = useProductsPage();

  const columns = useMemo(
    () =>
      getProductsColumns({
        viewDetails: productsMethods.viewDetails,
        openEdit: productsMethods.openEdit,
        setActiveProduct: productsMethods.setActiveProduct,
        setIsDeleteOpen: productsMethods.setIsDeleteOpen,
      }),
    [
      productsMethods.viewDetails,
      productsMethods.openEdit,
      productsMethods.setActiveProduct,
      productsMethods.setIsDeleteOpen,
    ],
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Top Header & Reusable Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Products" description="Manage your catalog" />
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={productsMethods.openCreate}
          className="bg-surface-mint text-brand-primary border-brand-primary/25 hover:bg-surface-mint/80 font-semibold shadow-2xs cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Product</span>
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
            value={productsMethods.filters.Search}
            onChange={(e) =>
              productsMethods.handleFilterChange("Search", e.target.value)
            }
            className="w-full pl-9 pr-4 h-10 rounded-lg border border-border-input text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-shadow"
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 flex-1">
          <AppSelect
            value={productsMethods.filters.CategorySlug || "all"}
            onChange={(val) =>
              productsMethods.handleFilterChange(
                "CategorySlug",
                val === "all" ? "" : val,
              )
            }
            options={[
              { label: "All Categories", value: "all" },
              ...productsMethods.categoryOptions,
            ]}
            className="min-w-35 flex-1 h-10!"
          />

          <AppSelect
            value={
              productsMethods.filters.InStock === "" ||
              productsMethods.filters.InStock === undefined
                ? "all"
                : productsMethods.filters.InStock.toString()
            }
            onChange={(val) => {
              let stockVal: boolean | "" = "";
              if (val === "true") stockVal = true;
              if (val === "false") stockVal = false;
              productsMethods.handleFilterChange("InStock", stockVal);
            }}
            options={[
              { label: "All Stock", value: "all" },
              { label: "In Stock", value: "true" },
              { label: "Out of Stock", value: "false" },
            ]}
            className="min-w-30 flex-1 h-10!"
          />

          <AppSelect
            value={
              !productsMethods.filters.SortBy
                ? "all"
                : `${productsMethods.filters.SortBy}-${productsMethods.filters.SortDir}`
            }
            onChange={(val) => {
              if (val === "all") {
                productsMethods.handleFilterChange("SortBy", "");
                productsMethods.handleFilterChange("SortDir", "");
              } else {
                const [sortBy, sortDir] = val.split("-");
                productsMethods.handleFilterChange("SortBy", sortBy || "");
                productsMethods.handleFilterChange("SortDir", sortDir || "");
              }
            }}
            options={[
              { label: "Sort by...", value: "all" },
              { label: "Name (A-Z)", value: "name-asc" },
              { label: "Name (Z-A)", value: "name-desc" },
              { label: "Price (Low to High)", value: "price-asc" },
              { label: "Price (High to Low)", value: "price-desc" },
            ]}
            className="min-w-37.5 flex-1 h-10!"
          />

          <button
            onClick={productsMethods.clearFilters}
            className="h-10 px-3 flex items-center justify-center rounded-[7px] border border-border-input text-text-secondary hover:bg-surface-soft hover:text-status-danger-text transition-colors shrink-0 cursor-pointer"
            title="Clear Filters"
          >
            <FilterX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {productsMethods.isError ? (
        <div className="p-12 text-center text-status-danger-text bg-white rounded-xl border border-border-input shadow-xs">
          <Typography variant="body" className="inline">
            Failed to load products.
          </Typography>
          <Button
            variant="outline"
            size="md"
            onClick={() => productsMethods.refetch()}
            className="ml-4 cursor-pointer"
          >
            Retry
          </Button>
        </div>
      ) : (
        <AppTable
          data={productsMethods.products}
          columns={columns}
          isLoading={productsMethods.isLoading}
          emptyMessage="No products found matching your filters."
          paginationBar={
            <PaginationBar
              currentPage={productsMethods.page}
              totalPages={productsMethods.totalPages}
              onPageChange={productsMethods.handlePageChange}
              pageSize={productsMethods.pageSize}
              onPageSizeChange={productsMethods.handlePageSizeChange}
              showPageSizeSelect={true}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          }
        />
      )}

      {/* Slide-over Form Sheet */}
      <ProductFormSheet
        isOpen={productsMethods.isSheetOpen}
        onClose={() => productsMethods.setIsSheetOpen(false)}
        activeProduct={productsMethods.activeProduct}
        onSubmit={productsMethods.handleFormSubmit}
        isSubmitting={productsMethods.isCreating || productsMethods.isUpdating}
        categoryOptions={productsMethods.categoryOptions}
        availableTags={productsMethods.availableTags}
      />

      {/* Delete Confirmation Modal */}
      <ProductDeleteModal
        isOpen={productsMethods.isDeleteOpen}
        onClose={() => productsMethods.setIsDeleteOpen(false)}
        activeProduct={productsMethods.activeProduct}
        onConfirm={() => {
          if (productsMethods.activeProduct) {
            productsMethods.deleteProduct(productsMethods.activeProduct.slug);
          }
        }}
        isDeleting={productsMethods.isDeleting}
      />
    </div>
  );
}
