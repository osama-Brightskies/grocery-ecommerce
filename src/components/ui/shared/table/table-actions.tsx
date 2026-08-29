import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TableActionRow = Record<string, unknown>;

interface TableActionsProps {
  row: TableActionRow;
  onView?: (row: TableActionRow) => void;
  onEdit?: (row: TableActionRow) => void;
  onDelete?: (row: TableActionRow) => void;
}

export function TableActions({
  row,
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) {
  const navigate = useNavigate();
  // Aggressively extract the ID from the row object
  const productId = row?.id || row?.Id || row?.ID;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onView) onView(row);
          else if (productId) navigate(`/products/${productId}`);
        }}
        className="text-muted-foreground hover:text-primary p-1"
      >
        <Eye className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onEdit) onEdit(row);
          else if (productId) navigate(`/products/${productId}`);
        }}
        className="text-muted-foreground hover:text-foreground p-1"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onDelete) onDelete(row);
        }}
        className="text-destructive hover:text-destructive/80 p-1"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
