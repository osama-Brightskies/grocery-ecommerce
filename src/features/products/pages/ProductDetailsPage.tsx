import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import { useProductDetails } from "../hooks/useProductDetails";
import { ProductFormSheet } from "../components/ProductFormSheet";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import PageHeader from "@/components/ui/shared/page-header";
import { getImageUrl } from "@/lib/utils";
import type { Product } from "../types/products.types";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const hook = useProductDetails(slug || "");

  if (hook.isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <Typography variant="muted">Loading product details...</Typography>
      </div>
    );
  }

  if (hook.isError || !hook.product) {
    return (
      <div className="w-full max-w-3xl mx-auto px-6 py-12 text-center space-y-4">
        <Typography variant="h2" className="text-status-danger-text">
          Product Not Found
        </Typography>
        <Typography variant="body" className="text-text-secondary">
          The product you are looking for does not exist.
        </Typography>
        <Button variant="outline" onClick={() => hook.navigate("/products")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </Button>
      </div>
    );
  }

  // Type assertion for ease of use
  const p = hook.product as Product;
  // <-- USING CACHE-BUSTING UTILITY
  const imageUrl = getImageUrl(p.productImageUrl, p.updatedAt);

  const createdDate = p.creationDate
    ? new Date(p.creationDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      {/* Top Header & Back Link & Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <PageHeader
            title="Products"
            description="Review and manage a single product"
          />
          <Link
            to="/products"
            className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-medium mt-3 transition-colors"
          >
            <span className="mr-1">‹</span> Back to products
          </Link>
        </div>

        {/* Action Buttons: Edit on left, Delete on right */}
        <div className="flex items-center gap-3 shrink-0 mt-4 sm:mt-0">
          <Button
            onClick={() => hook.setIsSheetOpen(true)}
            className="bg-brand-primary text-white hover:bg-brand-medium font-semibold px-6 shadow-sm"
          >
            Edit product
          </Button>
          <Button
            variant="outline"
            onClick={() => hook.setIsDeleteOpen(true)}
            className="bg-status-danger-bg border-status-danger-text text-status-danger-text hover:bg-status-danger-text hover:text-white transition-colors font-semibold px-6"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image & Title */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-input h-full flex flex-col">
            {/* BEAUTIFUL PREMIUM IMAGE CONTAINER */}
            <div className="w-full flex-1 min-h-70 bg-surface-soft rounded-xl flex items-center justify-center mb-6 p-8 overflow-hidden border border-border-input/50 relative group">
              {p.productImageUrl ? (
                <img
                  src={imageUrl}
                  alt={p.altText || "Product image"}
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              ) : (
                <Typography
                  variant="h1"
                  className="text-brand-primary/40 tracking-widest text-2xl font-bold"
                >
                  {p.name?.toUpperCase()}
                </Typography>
              )}
            </div>

            {/* ALIGNED TEXT DETAILS */}
            <div className="mt-auto">
              <Typography
                variant="h1"
                className="text-2xl font-bold text-sidebar-bg mb-2"
              >
                {p.name}
              </Typography>
              <Typography
                variant="muted"
                className="text-sm text-text-secondary flex items-center gap-2"
              >
                <span className="capitalize text-brand-primary font-medium">
                  {p.categorySlug}
                </span>
                <span className="text-border-input">•</span>
                <span className="font-mono text-xs">{p.slug}</span>
              </Typography>
            </div>
          </div>
        </div>

        {/* Right Column: Overview List */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-input h-full">
            <Typography variant="h2" className="text-lg font-bold mb-6">
              Product overview
            </Typography>

            <div className="flex flex-col">
              <Row
                label="Category"
                value={<span className="capitalize">{p.categorySlug}</span>}
              />
              <Row
                label="Price"
                value={`$${typeof p.price === "number" ? p.price.toFixed(2) : 0} / unit`}
              />
              <Row label="In stock" value={`${p.stockQuantity} units`} />
              <Row
                label="Status"
                value={
                  <span
                    className={`font-medium px-2.5 py-1 rounded-md text-xs uppercase tracking-wider ${
                      p.stockQuantity > 0
                        ? "bg-surface-mint text-brand-primary"
                        : "bg-status-danger-bg text-status-danger-text"
                    }`}
                  >
                    {p.stockQuantity > 0 ? "Active" : "Out of stock"}
                  </span>
                }
              />
              <Row label="Created" value={createdDate} />

              {/* Tags Section */}
              <div className="flex justify-between items-start py-5 border-b border-border-input last:border-0">
                <Typography
                  variant="body"
                  className="text-text-secondary w-1/3"
                >
                  Tags
                </Typography>
                <div className="w-2/3 text-right flex justify-end flex-wrap gap-2">
                  {p.tags && p.tags.length > 0 ? (
                    p.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-surface-soft border border-border-input text-sidebar-bg text-xs rounded-full font-medium shadow-xs"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <Typography
                      variant="body"
                      className="text-text-subtle italic"
                    >
                      None
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductFormSheet
        isOpen={hook.isSheetOpen}
        onClose={() => hook.setIsSheetOpen(false)}
        activeProduct={p}
        onSubmit={hook.handleFormSubmit}
        isSubmitting={hook.isUpdating}
        categoryOptions={hook.categoryOptions}
        availableTags={hook.availableTags}
      />
      <ProductDeleteModal
        isOpen={hook.isDeleteOpen}
        onClose={() => hook.setIsDeleteOpen(false)}
        activeProduct={p}
        onConfirm={hook.deleteProduct}
        isDeleting={hook.isDeleting}
      />
    </div>
  );
}

interface RowProps {
  label: string;
  value: React.ReactNode;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex justify-between items-center py-5 border-b border-border-input last:border-0">
      <Typography variant="body" className="text-text-secondary w-1/3">
        {label}
      </Typography>
      <Typography
        variant="body"
        className="font-semibold text-sidebar-bg w-2/3 text-right"
      >
        {value}
      </Typography>
    </div>
  );
}
