import * as React from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";

import { tagFormSchema, type TagFormValues } from "../schemas/tags.schema";
import { FormInput } from "@/components/ui/form-fields/FormInput";

export interface TagFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: {
    name: string;
    slug?: string | null;
  } | null;
  onSubmit: (data: TagFormValues) => void;
  isSubmitting?: boolean;
}

export function TagFormSheet({
  isOpen,
  onClose,
  tag,
  onSubmit,
  isSubmitting,
}: TagFormSheetProps) {
  const methods = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: "",
    } as TagFormValues,
  });

  React.useEffect(() => {
    if (tag && isOpen) {
      methods.reset({
        name: tag.name || "",
        ...(tag.slug ? { slug: tag.slug } : {}),
      } as TagFormValues);
    } else if (!isOpen) {
      methods.reset({
        name: "",
      } as TagFormValues);
    }
  }, [tag, isOpen, methods]);

  if (!isOpen) return null;

  const handleFormSubmit: SubmitHandler<TagFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-border-input animate-in slide-in-from-right duration-300">
        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          <div className="flex items-start justify-between pb-4 border-b border-border-input">
            <div>
              <Typography variant="h3" className="font-bold text-sidebar-bg">
                {tag ? "Edit Tag" : "Create Tag"}
              </Typography>
              <Typography
                variant="body"
                className="text-sm text-text-secondary mt-1"
              >
                {tag
                  ? "Update tag details below."
                  : "Provide the details to create a new tag."}
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
              id="tag-form"
              onSubmit={methods.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormInput
                name="name"
                label="Tag Name"
                placeholder="e.g. Organic, Best Seller"
              />
            </form>
          </FormProvider>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-input bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 border-border-input text-sidebar-bg hover:bg-surface-soft font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="tag-form"
            variant="primary"
            disabled={isSubmitting}
            className="h-11 bg-brand-primary hover:opacity-90 text-white font-semibold shadow-none"
          >
            {isSubmitting ? "Saving..." : tag ? "Save Changes" : "Create Tag"}
          </Button>
        </div>
      </div>
    </div>
  );
}
