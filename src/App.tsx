import * as React from "react";
import { Sidebar } from "./components/ui/sidebar";
import { DataTable } from "./components/ui/table";
import { Pagination } from "./components/ui/pagination";
import { StatusBadge } from "./components/ui/table/status-badge";
import { mockProducts } from "./data/mock-products";

export default function App() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading] = React.useState(false);
  const INIT_PAGE_SIZE = 5;

  const totalPages = Math.ceil(mockProducts.length / INIT_PAGE_SIZE);
  const startIndex = (currentPage - 1) * INIT_PAGE_SIZE;
  const currentProducts = mockProducts.slice(
    startIndex,
    startIndex + INIT_PAGE_SIZE
  );

  return (
    <div className="flex min-h-screen bg-[#F4F7F4] font-sans antialiased">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          <DataTable
            data={currentProducts}
            isLoading={isLoading}
            customCells={{
              status: (product) => <StatusBadge status={product.status} />,
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