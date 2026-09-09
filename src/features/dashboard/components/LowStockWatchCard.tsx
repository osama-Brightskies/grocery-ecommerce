import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";
import { getImageUrl, cn } from "@/lib/utils";
import type { Product } from "@/features/products/products.types";

const LOW_STOCK_THRESHOLD = 10;
const CRITICAL_DANGER_THRESHOLD = 5;

export type LowStockWatchCardProps = {
  products: Product[];
  isLoading?: boolean;
};

export function LowStockWatchCard({
  products = [],
  isLoading = false,
}: LowStockWatchCardProps) {
  const navigate = useNavigate();

  // 1. Strictly parse stock numbers & sort 0-stock to the very top
  const lowStockProducts: Product[] = useMemo(() => {
    return products
      .filter((p) => Number(p.stockQuantity ?? 0) <= LOW_STOCK_THRESHOLD)
      .sort(
        (a, b) => Number(a.stockQuantity ?? 0) - Number(b.stockQuantity ?? 0),
      );
  }, [products]);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-status-danger-bg text-status-danger-text flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <Typography
              variant="h2"
              className="text-lg font-bold text-sidebar-bg"
            >
              Low Stock Watchlist
            </Typography>
            <Typography variant="muted" className="text-xs text-text-secondary">
              Catalog items with {LOW_STOCK_THRESHOLD} or fewer units remaining
            </Typography>
          </div>
        </div>

        {!isLoading && lowStockProducts.length > 0 && (
          <Badge
            variant="danger"
            className="text-xs px-2.5 py-0.5 font-semibold"
          >
            {lowStockProducts.length} Items Critical
          </Badge>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-8 text-center">
          <Typography variant="muted" className="text-sm text-text-secondary">
            Checking inventory levels...
          </Typography>
        </div>
      ) : lowStockProducts.length === 0 ? (
        // Healthy State
        <div className="py-12 text-center flex flex-col items-center justify-center space-y-3 bg-surface-soft rounded-xl border border-border/50">
          <div className="w-12 h-12 rounded-full bg-surface-mint text-brand-primary flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <Typography
              variant="h3"
              className="text-base font-bold text-sidebar-bg"
            >
              All inventory levels are healthy
            </Typography>
            <Typography
              variant="muted"
              className="text-xs text-text-secondary max-w-sm mx-auto"
            >
              Every item in your store currently has more than{" "}
              {LOW_STOCK_THRESHOLD} units in stock. No immediate restocking is
              required.
            </Typography>
          </div>
        </div>
      ) : (
        // Watchlist Items Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockProducts.map((product) => {
            const stock = Number(product.stockQuantity ?? 0);
            const isOutOfStock = stock <= 0;
            const isUnderFive = stock < CRITICAL_DANGER_THRESHOLD;
            const progressPercent = Math.min(
              100,
              Math.max(0, (stock / LOW_STOCK_THRESHOLD) * 100),
            );

            return (
              <div
                key={product.slug}
                onClick={() => navigate(`/products/${product.slug}`)}
                className={cn(
                  "rounded-xl border p-4 space-y-3 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-2xs hover:shadow-xs",
                  // 🪄 Highlight Out-of-Stock cards in RED with a border & soft red background
                  isOutOfStock
                    ? "border-status-danger-text/50 bg-status-danger-bg/25 hover:border-status-danger-text hover:bg-status-danger-bg/40 ring-1 ring-status-danger-text/20"
                    : "bg-surface-soft hover:bg-surface-mint/30 border-border/70 hover:border-brand-primary/50",
                )}
              >
                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg p-1.5 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-200 border",
                      isOutOfStock
                        ? "bg-white border-status-danger-text/30"
                        : "bg-card border-border",
                    )}
                  >
                    <img
                      src={getImageUrl(product.productImageUrl)}
                      alt={product.altText || product.name}
                      className="max-h-full max-w-full object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.png";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Typography
                      variant="body"
                      className="font-bold text-sidebar-bg text-sm truncate group-hover:text-brand-primary transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="muted"
                      className="text-xs text-text-secondary truncate capitalize"
                    >
                      {product.categorySlug} • ${product.price.toFixed(2)}
                    </Typography>
                  </div>
                </div>

                {/* Stock Level & Visual Gauge */}
                <div className="space-y-1.5 pt-1 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <Typography
                      variant="muted"
                      className="text-xs text-text-secondary font-medium"
                    >
                      Remaining
                    </Typography>

                    {isOutOfStock ? (
                      <Badge
                        variant="danger"
                        className="text-[11px] px-2 py-0.5 font-bold shadow-xs"
                      >
                        Out of Stock (0)
                      </Badge>
                    ) : isUnderFive ? (
                      <Badge variant="danger" className="text-[11px] px-2 py-0">
                        {stock} {stock === 1 ? "unit" : "units"} left
                      </Badge>
                    ) : (
                      <Badge
                        variant="warning"
                        className="text-[11px] px-2 py-0"
                      >
                        {stock} units left
                      </Badge>
                    )}
                  </div>

                  {/* 🪄 If Out of Stock: NO progress bar, show urgent alert text */}
                  {isOutOfStock ? (
                    <Typography
                      variant="muted"
                      className="text-[11px] text-status-danger-text font-semibold flex items-center gap-1 pt-0.5"
                    >
                      ⚠️ Warehouse alert: 0 units available
                    </Typography>
                  ) : (
                    /* Progress Bar only shown when stock > 0 */
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isUnderFive
                            ? "bg-status-danger-text"
                            : "bg-status-warning-text"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LowStockWatchCard;
