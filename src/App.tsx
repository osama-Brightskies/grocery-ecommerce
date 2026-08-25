import * as React from "react";
import { Sidebar } from "./components/ui/sidebar";
import { DataTable } from "./components/ui/table";
import { Pagination } from "./components/ui/pagination";
import { StatusBadge } from "./components/ui/table/status-badge";
import { TableActions } from "./components/ui/table/table-actions";
import { mockProducts } from "./data/mock-products";
import type { Product } from "./data/mock-products";

export default function App() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading] = React.useState(false);
  const PAGE_SIZE = 5;

  const totalPages = Math.ceil(mockProducts.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProducts = mockProducts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          

          <DataTable<Product>
            data={currentProducts}
            isLoading={isLoading}
            columnMapping={{
              CurrentStatus: "status",
              ProductTitle: "name",
            }}
            headerLabels={{
              status: "Item Status",
            }}
            renderCell={(key, product) => {
              // Cast product safely through unknown to support both current and future backend keys
              const record = product as unknown as Record<string, unknown>;

              if (key === "status") {
                const statusValue = String(record["CurrentStatus"] || record["status"] || "");
                return <StatusBadge status={statusValue as Product["status"]} />;
              }
              if (key === "actions") {
                return (
                  <TableActions
                    onView={() => console.log("View:", product.id)}
                    onEdit={() => console.log("Edit:", product.id)}
                    onDelete={() => console.log("Delete:", product.id)}
                  />
                );
              }
              return String(record[key] ?? "");
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