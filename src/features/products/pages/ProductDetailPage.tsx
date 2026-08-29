import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, deleteProduct } from "../../../api/products.api";
import PageHeader from "@/components/ui/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Product {
  slug: string;
  name: string;
  image?: string;
  altText?: string;
  category: string;
  brand: string;
  stock: number;
  price: number;
  tags: Array<{ name?: string } | string>;
  description?: string;
}

export default function ProductDetailPage() {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (slug) {
      fetchProductById(slug)
        .then((data) => {
          setProduct(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [slug]);

  const handleConfirmDelete = async () => {
    if (!product?.slug) return;
    try {
      await deleteProduct(product.slug);
      navigate("/products");
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  if (isLoading)
    return (
      <div className="p-12 flex items-center justify-center text-muted-foreground animate-pulse text-sm">
        Loading product data...
      </div>
    );
  if (!product)
    return (
      <div className="p-12 flex items-center justify-center text-foreground text-sm">
        Product not found.
      </div>
    );

  const stock = Number(product.stock);
  let statusText = "In stock";
  let statusColor = "text-emerald-600";
  if (stock === 0) {
    statusText = "Out of Stock";
    statusColor = "text-status-danger-text";
  } else if (stock <= 15) {
    statusText = "Low Stock";
    statusColor = "text-status-warning-text";
  }

  return (
    <div className="w-full min-h-full px-8 py-6 max-w-7xl mx-auto flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <PageHeader
            title="Product details"
            description="Review and manage a single product"
          />
        </div>

        <button
          onClick={() => navigate("/products")}
          className="text-brand-primary text-xs font-bold hover:underline block cursor-pointer"
        >
          &lsaquo; Back to products
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
          {/* Image Card */}
          <div className="bg-card rounded-2xl p-8 shadow-xs border border-border-input flex flex-col items-center justify-center min-h-105">
            {product.image ? (
              <img
                src={product.image}
                alt={product.altText || product.name}
                className="max-w-full max-h-70 object-contain rounded-xl"
              />
            ) : (
              <div className="w-full h-70 bg-surface-mint rounded-xl flex items-center justify-center text-4xl font-bold text-brand-primary tracking-widest uppercase">
                {product.name.split(" ").pop()}
              </div>
            )}
            <div className="w-full mt-6 text-left">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {product.name}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {product.category} &middot; {product.brand}
              </p>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-card rounded-2xl p-8 shadow-xs border border-border-input flex flex-col justify-between min-h-105">
            <div>
              <h3 className="text-sm font-bold mb-4 text-foreground uppercase tracking-wider">
                Product overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-border-input">
                  <span className="text-sm text-text-secondary">Category</span>
                  <span className="text-sm font-semibold text-foreground">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border-input">
                  <span className="text-sm text-text-secondary">Price</span>
                  <span className="text-sm font-semibold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border-input">
                  <span className="text-sm text-text-secondary">In stock</span>
                  <span className="text-sm font-semibold text-foreground">
                    {product.stock} units
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border-input">
                  <span className="text-sm text-text-secondary">Status</span>
                  <span className={`text-sm font-semibold ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border-input">
                  <span className="text-sm text-text-secondary">Tags</span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {product.tags.length > 0 ? (
                      product.tags.map(
                        (tag: { name?: string } | string, i: number) => (
                          <span
                            key={i}
                            className="bg-surface-mint px-2.5 py-1 rounded-md text-xs font-medium text-brand-primary"
                          >
                            {typeof tag === "string" ? tag : tag.name}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="text-xs font-semibold text-text-secondary">
                        No tags
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-text-secondary block mb-1">
                    Description
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {product.description || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-border-input">
              <Button
                variant="primary"
                size="default"
                onClick={() => navigate(`/products/${product.slug}/edit`)}
              >
                Edit product
              </Button>
              <Button
                variant="danger"
                size="default"
                onClick={() => setIsDeleting(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {product.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 sm:justify-end">
            <Button
              variant="outline"
              size="default"
              onClick={() => setIsDeleting(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="default"
              onClick={handleConfirmDelete}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
