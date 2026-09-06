import { Typography } from "@/components/ui/shared/Typography";
import { Badge } from "@/components/ui/badge";
import { getImageUrl, formatDate } from "@/lib/utils";
import type { Category } from "../types/categories.types";

export type CategoryHeaderCardProps = {
  category: Category;
  productsCount: number;
};

export function CategoryHeaderCard({
  category,
  productsCount,
}: CategoryHeaderCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
      {/* Large S3 Image Thumbnail */}
      <div className="w-32 h-32 rounded-xl bg-surface-soft border border-border/80 p-3 flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={getImageUrl(category.imageUrl, category.updatedAt)}
          alt={category.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Info & Dynamic Count Badge */}
      <div className="space-y-2 text-center sm:text-left flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <Typography
            variant="h1"
            className="text-2xl md:text-3xl font-bold text-sidebar-bg"
          >
            {category.name}
          </Typography>

          <Badge
            variant="primary"
            className="self-center sm:self-auto font-mono text-xs"
          >
            {productsCount} {productsCount === 1 ? "Product" : "Products"}
          </Badge>
        </div>

        <Typography
          variant="muted"
          className="text-sm font-mono text-text-secondary"
        >
          {category.slug}
        </Typography>

        <Typography
          variant="muted"
          className="text-xs text-text-secondary pt-1"
        >
          Created {formatDate(category.createdAt)}
        </Typography>
      </div>
    </div>
  );
}

export default CategoryHeaderCard;
