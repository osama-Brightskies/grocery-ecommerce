import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronDown } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import type { CategoryProduct } from "../types/categories.types";
import { AppTable, type DefaultTableFeatures } from "@/components/ui/AppTable";

export type CategoryProductsTableProps = {
  products: CategoryProduct[];
  isLoading?: boolean;
  hasNext?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
};

const columnHelper = createColumnHelper<
  DefaultTableFeatures,
  CategoryProduct
>();

export function CategoryProductsTable({
  products,
  isLoading = false,
  hasNext = false,
  isFetchingMore = false,
  onLoadMore,
}: CategoryProductsTableProps) {
  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      columnHelper.columns([
        // 1. PRODUCT (Thumbnail + Title)
        columnHelper.accessor("name", {
          header: "PRODUCT",
          cell: ({ row }) => {
            const product = row.original;
            return (
              <div className="flex items-center gap-3 text-left pl-2">
                <div className="w-10 h-10 rounded-lg bg-surface-soft border border-border p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={getImageUrl(product.productImageUrl)}
                    alt={product.altText || product.name}
                    className="max-h-full max-w-full object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-image.png";
                    }}
                  />
                </div>
                <Typography
                  variant="body"
                  className="font-bold text-sidebar-bg truncate"
                >
                  {product.name}
                </Typography>
              </div>
            );
          },
        }),

        // 2. PRICE
        columnHelper.accessor("price", {
          header: "PRICE",
          cell: (info) => (
            <Typography
              variant="body"
              className="font-semibold text-sidebar-bg"
            >
              ${Number(info.getValue() ?? 0).toFixed(2)}
            </Typography>
          ),
        }),

        // 3. STOCK (No Stock = 0, Low Stock = 1-10, Normal > 10)
        columnHelper.accessor("stockQuantity", {
          header: "STOCK",
          cell: (info) => {
            const stock = info.getValue() ?? 0;

            if (stock === 0) {
              return (
                <Badge variant="danger" className="text-xs">
                  No stock (0)
                </Badge>
              );
            }

            if (stock <= 10) {
              return (
                <Badge variant="warning" className="text-xs">
                  Low stock ({stock})
                </Badge>
              );
            }

            return (
              <Typography
                variant="body"
                className="text-text-secondary font-medium"
              >
                {stock}
              </Typography>
            );
          },
        }),

        // 4. ACTIONS (Navigates to /products/:slug)
        columnHelper.display({
          id: "actions",
          header: "ACTIONS",
          cell: ({ row }) => (
            <button
              type="button"
              onClick={() => navigate(`/products/${row.original.slug}`)}
              className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-mint transition-colors cursor-pointer"
              title="View product details"
            >
              <Eye className="w-4 h-4" />
            </button>
          ),
        }),
      ]),
    [navigate],
  );

  return (
    <div className="space-y-4">
      <AppTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products in this category yet."
        paginationBar={
          products.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border select-none">
              <Typography
                variant="muted"
                className="text-xs text-text-secondary"
              >
                Showing {products.length} products
              </Typography>

              {hasNext && (
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={isFetchingMore}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border bg-card text-xs font-semibold text-sidebar-bg hover:bg-surface-soft hover:border-brand-primary/40 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <span>{isFetchingMore ? "Loading..." : "Load more"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                </button>
              )}
            </div>
          ) : null
        }
      />
    </div>
  );
}

export default CategoryProductsTable;
