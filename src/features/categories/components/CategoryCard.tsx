import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { getImageUrl } from "@/lib/utils";
import type { Category } from "../types/categories.types";

export type CategoryCardProps = {
  category: Category;
  productCount?: number;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
};

export function CategoryCard({
  category,
  productCount,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/categories/${category.slug}`)}
      className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:shadow-md hover:border-brand-primary/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
    >
      <div className="w-full h-36 rounded-xl bg-surface-soft flex items-center justify-center p-3 mb-4 overflow-hidden border border-border/50 group-hover:bg-surface-mint/50 transition-colors">
        <img
          src={getImageUrl(category.imageUrl, category.updatedAt)}
          alt={category.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
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

        {/* Actions Container */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigating to the details page
              onEdit?.(category);
            }}
            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors"
            title="Edit category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigating to the details page
              onDelete?.(category);
            }}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
