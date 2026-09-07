import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";

export type CategoryDetailHeaderProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function CategoryDetailHeader({
  onEdit,
  onDelete,
}: CategoryDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/categories")}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <Typography variant="body" className="font-medium text-inherit">
          Categories
        </Typography>
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <Button
          variant="outline"
          size="default"
          onClick={onEdit}
          className="border-border hover:border-brand-primary text-sidebar-bg font-semibold cursor-pointer"
        >
          <Pencil className="w-4 h-4 mr-1.5" />
          <span>Edit category</span>
        </Button>

        <Button
          variant="danger"
          size="default"
          onClick={onDelete}
          className="font-semibold cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          <span>Delete category</span>
        </Button>
      </div>
    </div>
  );
}

export default CategoryDetailHeader;
