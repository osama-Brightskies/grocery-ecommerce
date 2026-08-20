import * as React from "react";
import { Sidebar } from "./components/ui/sidebar";
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./components/ui/table";
import { Pagination } from "./components/ui/pagination";
import { StatusBadge } from "./components/ui/table/status-badge";
import { TableActions } from "./components/ui/table/table-actions";
import { mockProducts } from "./data/mock-products";
import { Typography } from "./components/Typography";

export default function App() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = mockProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="flex min-h-screen bg-[#F4F7F4] font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          <Typography variant="h1" className="text-[#1C2D27]">
            Products
          </Typography>

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow isHeader>
                  <TableHead className="w-70 text-left">PRODUCT</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead>PRICE</TableHead>
                  <TableHead>STOCK</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-left">
                      <Typography
                        variant="body"
                        className="font-bold text-[#1C2D27]"
                      >
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-center">
                      <Typography
                        variant="muted"
                        className="font-normal text-[#64748B]"
                      >
                        {product.category}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-center">
                      <Typography
                        variant="body"
                        className="font-semibold text-[#1C2D27]"
                      >
                        {product.price}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-center">
                      <Typography
                        variant="body"
                        className="font-normal text-[#1C2D27]"
                      >
                        {product.stock}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <TableActions
                        onView={() => console.log("View:", product.id)}
                        onEdit={() => console.log("Edit:", product.id)}
                        onDelete={() => console.log("Delete:", product.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </TableContainer>
        </div>
      </main>
    </div>
  );
}
