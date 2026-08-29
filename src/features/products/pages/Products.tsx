import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@/components/ui/pagination";
import PageHeader from "@/components/ui/shared/page-header";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { fetchProducts, deleteProduct } from "../../../api/products.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export default function Products() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null,
  );

  const PAGE_SIZE = 5;

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    fetchProducts()
      .then((res) => {
        setAllProducts(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setAllProducts([]);
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(loadData, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const handleConfirmDelete = async () => {
    const targetSlug = productToDelete?.slug;
    if (!targetSlug) return;
    try {
      await deleteProduct(targetSlug);
      setProductToDelete(null);
      loadData();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const totalProducts = allProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProducts = allProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const lowStockCount = allProducts.filter(
    (p) => p.stock > 0 && p.stock <= 15,
  ).length;
  const uniqueCategories = new Set(allProducts.map((p) => p.category)).size;

  const showingStart = totalProducts === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + PAGE_SIZE, totalProducts);

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto space-y-4">
      {/* Top Header & Create Button */}
      <div className="flex justify-between items-center">
        <PageHeader
          title="Products"
          description="Manage your grocery inventory"
        />
        <button
          onClick={() => navigate("/products/create")}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create product
        </button>
      </div>

      {/* Inventory Overview Cards */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-xs flex items-center gap-12">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">
            Inventory overview
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{totalProducts}</span>
            <span className="text-xs text-muted-foreground">
              Total products
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 border-l border-border pl-12">
          <span className="text-2xl font-bold text-orange-500">
            {lowStockCount}
          </span>
          <span className="text-xs text-muted-foreground">Low stock</span>
        </div>
        <div className="flex items-baseline gap-2 border-l border-border pl-12">
          <span className="text-2xl font-bold text-primary">
            {uniqueCategories}
          </span>
          <span className="text-xs text-muted-foreground">Categories</span>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex justify-end pr-2 text-xs text-muted-foreground font-medium">
        Showing {showingStart}–{showingEnd} of {totalProducts}
      </div>

      {/* Table Container */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        {/* 7-Column Header Row */}
        <div className="grid grid-cols-7 px-8 py-4 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/20">
          <span className="col-span-2">Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-muted-foreground animate-pulse text-sm">
            Loading products...
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No products found.
          </div>
        ) : (
          currentProducts.map((product) => {
            const stock = Number(product.stock);

            let statusBadge = (
              <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block">
                In stock
              </span>
            );
            if (stock === 0) {
              statusBadge = (
                <span className="bg-destructive/10 text-destructive px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block">
                  Out of stock
                </span>
              );
            } else if (stock <= 15) {
              statusBadge = (
                <span className="bg-orange-500/10 text-orange-600 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block">
                  Low stock
                </span>
              );
            }

            return (
              <div
                key={product.slug}
                className="grid grid-cols-7 px-8 py-4 items-center border-b border-border/60 last:border-none hover:bg-muted/30 transition-colors text-sm"
              >
                <div className="col-span-2 pr-4">
                  <span
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className="font-bold text-foreground hover:text-primary cursor-pointer tracking-tight"
                  >
                    {product.name}
                  </span>
                </div>

                <span className="text-muted-foreground">
                  {product.category}
                </span>
                <span className="font-semibold text-foreground">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-muted-foreground">{stock}</span>
                <div>{statusBadge}</div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/products/${product.slug}/edit`)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
                    title="Edit Product"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProductToDelete(product)}
                    className="text-destructive hover:text-destructive/80 transition-colors cursor-pointer p-1"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {productToDelete?.name}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 sm:justify-end">
            <button
              onClick={() => setProductToDelete(null)}
              className="px-4 py-2 bg-transparent border border-input text-sm font-semibold rounded-lg hover:bg-accent cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-destructive text-destructive-foreground text-sm font-semibold rounded-lg hover:opacity-90 cursor-pointer"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
