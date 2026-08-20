import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import { AlertTriangle, X } from "lucide-react";

interface DeleteTagSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  tagName?: string;
}

export function DeleteTagSheet({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete Tag",
  tagName,
}: DeleteTagSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-border-input animate-in slide-in-from-right duration-300">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-input">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Typography variant="h3" className="font-bold text-sidebar-bg">
                {title}
              </Typography>
            </div>
            <Button
              variant="primary"
              size="default"
              onClick={onClose}
              disabled={isDeleting}
              className="text-text-secondary hover:text-sidebar-bg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-text-secondary leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-sidebar-bg">
                {tagName || "this tag"}
              </span>
              ? This action cannot be undone and will remove it from all
              associated products.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-input">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="h-11 px-5 border-border-input text-sidebar-bg hover:bg-surface-soft"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-11 px-5 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
          >
            {isDeleting ? "Deleting..." : "Delete Tag"}
          </Button>
        </div>
      </div>
    </div>
  );
}
