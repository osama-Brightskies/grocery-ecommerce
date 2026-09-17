import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import type { Tag } from "@/features/tags/types/tags.types";
import { tagFormSchema, type TagFormValues } from "../schemas/tags.schema";
import { FormInput } from "@/components/ui/form-fields/FormInput";

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
  onSubmit: (values: TagFormValues) => void;
  isSubmitting: boolean;
}) {
  const methods = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        name: activeTag?.name || "",
      });
    }
  }, [activeTag, isOpen, methods]);

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
              <Typography
                variant="body"
                className="text-sm text-text-secondary"
              >
                {activeTag
                  ? "Update the tag details below."
                  : "Add a new tag for your products."}
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
              <FormInput
                name="name"
                label="Tag Name"
                placeholder="Enter tag name"
              />
            </form>
          </FormProvider>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-border-input">
          <Button
            type="button"
            variant="danger"
            size="default"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-semibold cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            variant="outline"
            size="default"
            type="submit"
            form="tag-form-modal"
            disabled={isSubmitting}
            className="bg-surface-mint text-brand-primary border-brand-primary/25 hover:bg-surface-mint/80 font-semibold shadow-2xs cursor-pointer transition-all"
          >
            {isSubmitting ? "Saving..." : "Save Tag"}
          </Button>
        </div>
      </div>
    </div>
  );
}
