import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/shared/Typography";

export interface CategoryCardProps {
  name: string;
  productCount: string;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function CategoryCard({
  name,
  productCount,
  onEdit,
  onDelete,
  className,
}: CategoryCardProps) {
  const letter = name ? name.charAt(0).toUpperCase() : "";

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all relative group",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold text-lg shrink-0">
            {letter}
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-sidebar-bg font-bold text-base"
            >
              {name}
            </Typography>
            <Typography
              variant="muted"
              className="text-xs text-muted-foreground mt-0.5"
            >
              {productCount}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start ml-15 gap-3 mt-6 pt-3 border-t border-border">
        <button
          type="button"
          aria-label={`Edit ${name}`}
          onClick={onEdit}
          className="p-1.5 rounded-lg text-primary hover:bg-secondary transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label={`Delete ${name}`}
          onClick={onDelete}
          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CategoryCard;
