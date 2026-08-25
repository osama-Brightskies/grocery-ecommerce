import { createColumnHelper, tableFeatures } from "@tanstack/react-table";
import type { ProductItem } from "./types/products.types";

export const features = tableFeatures({
  
});
const columnHelper = createColumnHelper<typeof features, ProductItem>();

export const columns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: "Name",
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor("brand", {
    header: "Brand",
    cell: ({ row }) => row.original.brand ?? "—",
  }),
  columnHelper.accessor("category", {
    header: "Category",
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("stock", {
    header: "Stock",
  }),
  columnHelper.accessor("availabilityStatus", {
    header: "Status",
  }),
]);
