import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import type { Product } from "../types/products.types";

export function ProductDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeProduct: Product | null;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-border-input animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-border-input">
            <div className="space-y-1">
              <Typography
                variant="h3"
                className="font-bold text-status-danger-text"
              >
                Delete Product?
              </Typography>
              <Typography
                variant="body"
                className="text-sm text-text-secondary"
              >
                This action cannot be undone.
              </Typography>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-full w-8 h-8 flex items-center justify-center border border-border-input text-text-secondary hover:text-sidebar-bg hover:bg-surface-soft transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <Typography variant="body" className="text-sm text-text-secondary">
              Are you sure you want to delete this product? This will
              permanently remove it from the catalog.
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-border-input">
          <Button
            type="button"
            variant="danger"
            size="default"
            onClick={onClose}
            disabled={isDeleting}
            className="font-semibold cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="default"
            onClick={onConfirm}
            disabled={isDeleting}
            className="font-semibold cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            {isDeleting ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
