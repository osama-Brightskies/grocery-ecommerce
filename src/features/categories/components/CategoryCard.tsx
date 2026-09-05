import { useNavigate } from "react-router-dom";
import { Typography } from "@/components/ui/shared/Typography";
import { getImageUrl } from "@/lib/utils";
import type { Category } from "../types/categories.types";

export type CategoryCardProps = {
  category: Category;
  productCount?: number;
};

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/categories/${category.slug}`)}
      className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:shadow-md hover:border-brand-primary/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
    >
      <div className="w-full h-36 rounded-xl bg-surface-soft flex items-center justify-center p-3 mb-4 overflow-hidden border border-border/50 group-hover:bg-surface-mint/50 transition-colors">
        <img
          src={getImageUrl(category.imageUrl)}
          alt={category.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="space-y-1">
        <Typography
          variant="h3"
          className="text-base font-bold text-sidebar-bg group-hover:text-brand-primary transition-colors truncate"
        >
          {category.name}
        </Typography>

        <Typography
          variant="muted"
          className="text-xs text-text-secondary truncate font-mono"
        >
          {category.slug}
        </Typography>

        {productCount !== undefined && (
          <Typography
            variant="muted"
            className="text-xs text-text-secondary pt-1 font-medium"
          >
            {productCount} products
          </Typography>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;
