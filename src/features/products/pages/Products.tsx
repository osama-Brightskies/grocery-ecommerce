import * as React from "react";
import { StatusBadge } from "../components/status-badge";
import { TableActions } from "@/components/ui/shared/table/table-actions";
import { fetchProducts } from "@/api/products.api";
import type { ProductItem } from "../types/products.types";
import DataTable from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";

export default function Products() {
  const [data, setData] = React.useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const PAGE_SIZE = 5;

  React.useEffect(() => {
    let isMounted = true;

    fetchProducts(currentPage, PAGE_SIZE).then((res) => {
      if (isMounted) {
        setData(res.data);
        setTotalCount(res.total);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const tableColumns = [
    { key: "title", header: "Product" },
    { key: "brand", header: "Brand" },
    { key: "category", header: "Category" },
    { key: "price", header: "Price" },
    { key: "stock", header: "Stock" },
    { key: "availabilityStatus", header: "Status" },
    { key: "actions", header: "Actions" },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          <DataTable<ProductItem>
            data={data}
            columns={tableColumns}
            isLoading={isLoading}
            columnMapping={{
              CurrentStatus: "availabilityStatus",
              ProductTitle: "title",
            }}
            renderCell={(key: string, product: ProductItem) => {
              const record = product as unknown as Record<string, unknown>;

              if (key === "title") {
                const titleVal = String(
                  record["title"] || record["ProductTitle"] || "Untitled",
                );
                return (
                  <span className="font-bold text-sidebar-bg">{titleVal}</span>
                );
              }
              if (key === "price") {
                return (
                  <span className="font-semibold text-sidebar-bg">
                    ${Number(product.price ?? 0).toFixed(2)}
                  </span>
                );
              }
              if (key === "availabilityStatus") {
                const statusVal = String(
                  record["availabilityStatus"] ||
                    record["CurrentStatus"] ||
                    "In stock",
                );
                return (
                  <StatusBadge
                    status={
                      statusVal as "In stock" | "Low stock" | "Out of stock"
                    }
                  />
                );
              }
              if (key === "actions") {
                return (
                  <TableActions
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                );
              }
              return String(record[key] ?? "—");
            }}
            paginationBar={
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            }
          />
        </div>
      </main>
    </div>
  );
}
