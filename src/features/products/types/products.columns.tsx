import { Edit2, Trash2, Eye, Package as PackageIcon } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { getImageUrl } from "@/lib/utils";
import type { Product } from "./products.types";

interface ProductActionMethods {
  viewDetails: (slug: string) => void;
  openEdit: (product: Product) => void;
  setActiveProduct: (product: Product) => void;
  setIsDeleteOpen: (isOpen: boolean) => void;
}

export const getProductsColumns = (methods: ProductActionMethods) => [
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
          className={`font-semibold ${
            isLowStock ? "text-status-danger-text" : "text-sidebar-bg"
          }`}
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
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="View details"
            onClick={() => methods.viewDetails(p.slug)}
            className="text-brand-primary hover:text-brand-medium transition-colors p-1 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Edit item"
            onClick={() => methods.openEdit(p)}
            className="text-emerald-700 hover:text-emerald-900 transition-colors p-1 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Delete item"
            onClick={() => {
              methods.setActiveProduct(p);
              methods.setIsDeleteOpen(true);
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
