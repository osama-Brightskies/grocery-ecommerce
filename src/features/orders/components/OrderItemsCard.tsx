import { Link } from "react-router-dom";
import { Package, ExternalLink } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { getImageUrl } from "@/lib/utils";
import type { OrderItem } from "../types/orders.types";

export type OrderItemsCardProps = {
  items?: OrderItem[];
};

export function OrderItemsCard({ items = [] }: OrderItemsCardProps) {
  const totalCount = items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0,
  );

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center text-sidebar-bg shrink-0">
            <Package className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <Typography variant="h3" className="font-semibold text-sidebar-bg">
              Order items
            </Typography>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Products included in this order
            </Typography>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md bg-surface-mint text-brand-primary text-xs font-semibold">
          {totalCount} {totalCount === 1 ? "total item" : "total items"}
        </span>
      </div>

      {/* Items List */}
      {!items || items.length === 0 ? (
        <div className="py-8 text-center text-text-secondary">
          <Typography variant="body" className="text-xs">
            No item details available for this order.
          </Typography>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((item, index) => {
            const itemTotal =
              (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0);
            const imageUrl = item.productImage
              ? getImageUrl(item.productImage)
              : "";

            return (
              <div
                key={`${item.slug}-${index}`}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-surface-soft border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.altText || item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-text-subtle" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to={`/products/${item.slug}`}
                      className="font-semibold text-sm text-sidebar-bg hover:text-brand-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{item.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {item.description && (
                      <Typography
                        variant="muted"
                        className="text-xs text-text-secondary line-clamp-1 max-w-md"
                      >
                        {item.description}
                      </Typography>
                    )}
                  </div>
                </div>

                {/* Price & Quantity Summary */}
                <div className="flex items-center gap-6 self-end sm:self-auto shrink-0 text-right">
                  <div className="space-y-0.5">
                    <Typography
                      variant="muted"
                      className="text-[11px] text-text-secondary"
                    >
                      Price per unit
                    </Typography>
                    <Typography
                      variant="body"
                      className="text-xs font-medium text-sidebar-bg"
                    >
                      ${Number(item.unitPrice || 0).toFixed(2)}
                    </Typography>
                  </div>

                  <div className="space-y-0.5">
                    <Typography
                      variant="muted"
                      className="text-[11px] text-text-secondary"
                    >
                      Qty
                    </Typography>
                    <Typography
                      variant="body"
                      className="text-xs font-bold text-sidebar-bg"
                    >
                      ×{item.quantity}
                    </Typography>
                  </div>

                  <div className="space-y-0.5 min-w-17.5">
                    <Typography
                      variant="muted"
                      className="text-[11px] text-text-secondary"
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      variant="body"
                      className="text-sm font-bold text-brand-primary"
                    >
                      ${itemTotal.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderItemsCard;
