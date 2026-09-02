import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import type { Tag } from "@/features/tags/types/tags.types";

export function TagFormModal({
  isOpen,
  onClose,
  activeTag,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeTag: Tag | null;
  onSubmit: (values: { name: string; description?: string }) => void;
  isSubmitting: boolean;
}) {
  const methods = useForm<{ name: string; description?: string }>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (activeTag) {
      methods.reset({
        name: activeTag.name || "",
        description: "",
      });
    } else {
      methods.reset({
        name: "",
        description: "",
      });
    }
  }, [activeTag, methods]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-border-input animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-border-input">
            <div className="space-y-1">
              <Typography variant="h3" className="font-bold text-sidebar-bg">
                {activeTag ? "Edit Tag" : "Create Tag"}
              </Typography>
              <Typography variant="body" className="text-sm text-text-secondary">
                {activeTag ? "Update the tag details below." : "Add a new tag for your products."}
              </Typography>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full w-8 h-8 flex items-center justify-center border border-border-input text-text-secondary hover:text-sidebar-bg hover:bg-surface-soft transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <FormProvider {...methods}>
            <form
              id="tag-form-modal"
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <input
                {...methods.register("name")}
                placeholder="Enter tag name"
                className="w-full rounded-md border border-border-input px-3 py-2"
              />
            </form>
          </FormProvider>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-border-input">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 border-border-input text-sidebar-bg hover:bg-surface-soft font-semibold"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="tag-form-modal"
            disabled={isSubmitting}
            className="h-11 font-semibold bg-brand-primary text-white"
          >
            {isSubmitting ? "Saving..." : "Save Tag"}
          </Button>
        </div>
      </div>
    </div>
  );
}