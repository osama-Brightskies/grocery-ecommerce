import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "../Typography";

export interface CategoryCardProps {
  name: string;
  productCount: string;
  letter: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function CategoryCard({
  name,
  productCount,
  letter,
  onEdit,
  onDelete,
  className,
}: CategoryCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-border-input/60 p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all relative group",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EBF7EE] text-[#1B803A] flex items-center justify-center font-bold text-lg shrink-0">
            {letter}
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-[#1C2D27] font-bold text-base"
            >
              {name}
            </Typography>
            <Typography
              variant="muted"
              className="text-xs text-[#64748B] mt-0.5"
            >
              {productCount}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start ml-15 gap-2 mt-6 pt-3 border-t border-surface-soft">
        <button
          type="button"
          aria-label={`Edit ${name}`}
          onClick={onEdit}
          className="p-1.5 rounded-lg text-[#1B803A] hover:bg-[#EBF7EE] transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label={`Delete ${name}`}
          onClick={onDelete}
          className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEECEC] transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CategoryCard;
