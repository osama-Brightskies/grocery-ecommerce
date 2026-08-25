import { useQuery } from "@tanstack/react-query";
import { http } from "./api";
import { DataTable } from "./components/ui/shared/table/DataTable";
import { Sidebar } from "./components/ui/sidebar";
import type { Product } from "./features/products/types/products.types";
import { columns, features } from "./features/products/products.const";
export default function App() {
  // const [currentPage, setCurrentPage] = React.useState(1);
  // const [isLoading] = React.useState(false);
  // const PAGE_SIZE = 5;

  // const startIndex = (currentPage - 1) * PAGE_SIZE;
  // const currentProducts = mockProducts.slice(
  //   startIndex,
  //   startIndex + PAGE_SIZE,
  // );

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => http.get<Product>("https://dummyjson.com/products"),
  });
  console.log("🚀 ~ App ~ products:", products);

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          <DataTable
            data={products?.products ?? []}
            columns={columns}
            features={features}
          />
          {/* <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          /> */}
        </div>
      </main>
    </div>
  );
}
