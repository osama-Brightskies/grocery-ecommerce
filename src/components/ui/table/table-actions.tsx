import { Eye, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function TableActions({
  onView,
  onEdit,
  onDelete,
  className,
}: TableActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3", className)}>
      <button
        type="button"
        aria-label="View product"
        onClick={onView}
        className="text-[#2E7D32] hover:text-[#1B5E20] transition-colors p-1"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Edit product"
        onClick={onEdit}
        className="text-[#2E7D32] hover:text-[#1B5E20] transition-colors p-1"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Delete product"
        onClick={onDelete}
        className="text-[#E53935] hover:text-[#B71C1C] transition-colors p-1"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default TableActions;