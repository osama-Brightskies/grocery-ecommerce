import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TriangleAlert, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import type { Category } from "../types/categories.types";
import { toast } from "sonner";

export type DeleteCategoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  productsCount?: number;
};

export default function DeleteCategoryDialog({
  isOpen,
  onClose,
  category,
  productsCount = 0,
}: DeleteCategoryDialogProps) {
  const navigate = useNavigate();
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

  const { mutate: deleteCategory, isPending } = useDeleteCategory({
    onSuccess: () => {
      setIsDeletedSuccess(true);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleConfirmDelete = () => {
    deleteCategory(category.slug);
  };

  const handleSuccessClose = () => {
    setIsDeletedSuccess(false);
    onClose();
    navigate("/categories", { replace: true });
  };

  const handleDialogClose = () => {
    if (!isPending) {
      setIsDeletedSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-card border border-border rounded-2xl">
        {/* State 1: Success Modal (Figma Panel 6) */}
        {isDeletedSuccess ? (
          <div className="flex flex-col items-center text-center space-y-4 py-2">
            {/* Success Check Icon */}
            <div className="w-14 h-14 rounded-full bg-surface-mint text-brand-primary flex items-center justify-center animate-in zoom-in">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <DialogHeader className="space-y-1 text-center">
              <DialogTitle className="text-xl font-bold text-sidebar-bg">
                Category deleted
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary">
                &quot;{category.name}&quot; was deleted successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="pt-3 w-full">
              <Button
                variant="primary"
                size="default"
                onClick={handleSuccessClose}
                className="w-full font-semibold shadow-xs cursor-pointer"
              >
                <Typography variant="body" className="font-semibold text-white">
                  Done
                </Typography>
              </Button>
            </div>
          </div>
        ) : (
          /* State 2: Warning Confirmation Modal (Figma Panel 5) */
          <div className="flex flex-col items-center text-center space-y-4 py-2">
            {/* Warning Triangle Icon */}
            <div className="w-14 h-14 rounded-full bg-status-warning-bg text-status-warning-text flex items-center justify-center animate-in zoom-in">
              <TriangleAlert className="w-8 h-8" />
            </div>

            <DialogHeader className="space-y-2 text-center">
              <DialogTitle className="text-xl font-bold text-sidebar-bg">
                Delete category
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                Are you sure you want to delete &quot;{category.name}&quot;?
                {productsCount > 0 && (
                  <span className="block mt-2 text-xs font-medium text-sidebar-bg/90">
                    This category contains {productsCount} products. Deleting it
                    may affect product organization.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Modal Actions */}
            <div className="flex items-center justify-center gap-3 pt-3 w-full">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 font-semibold border-border cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                size="default"
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="flex-1 bg-status-danger-text hover:bg-status-danger-text/90 text-white font-semibold cursor-pointer shadow-xs"
              >
                <Typography variant="body" className="font-semibold text-white">
                  {isPending ? "Deleting..." : "Delete category"}
                </Typography>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
