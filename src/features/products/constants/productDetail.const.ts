import type { ProductDetail } from "../types/products.types";

interface ProductDetailColumn {
  accessorKey: keyof ProductDetail;
  header: string;
  cell: (info: { getValue: () => unknown }) => unknown;
}

export const productDetailColumns: ProductDetailColumn[] = [
  {
    accessorKey: "Brand",
    header: "Brand",
    cell: (info) => (info.getValue() as string) || "Unknown Brand",
  },
  {
    accessorKey: "Price",
    header: "Price",
    cell: (info) => `$${Number(info.getValue() ?? 0).toFixed(2)}`,
  },
  {
    accessorKey: "StockQuantity",
    header: "Stock Quantity",
    cell: (info) => `${info.getValue()} units`,
  },
  {
    accessorKey: "CategoryId",
    header: "Category ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "Description",
    header: "Description",
    cell: (info) => (info.getValue() as string) || "No description provided.",
  },
  {
    accessorKey: "TagIds",
    header: "Tag IDs",
    cell: (info) => {
      const tags = info.getValue() as number[];
      return tags && tags.length > 0 ? tags.join(", ") : "None";
    },
  },
];
