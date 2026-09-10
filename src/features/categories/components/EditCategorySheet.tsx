import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FormInput } from "@/components/ui/form-fields/FormInput";
import { FormImageUploader } from "@/components/ui/form-fields/FormImageUploader";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";

import { useUpdateCategory } from "../hooks/useUpdateCategory";
import type { Category } from "../types/categories.types";
import {
  updateCategorySchema,
  type UpdateCategoryFormValues,
} from "../schemas/categories.schema";
import { getImageUrl } from "@/lib/utils";

export type EditCategorySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
};

export default function EditCategorySheet({
  isOpen,
  onClose,
  category,
}: EditCategorySheetProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const methods = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      image: undefined,
    },
  });

  const {
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (isOpen && category) {
      methods.reset({
        name: category.name,
        image: undefined,
      });
    }
  }, [isOpen, category, methods]);

  const { mutate: updateCategory, isPending } = useUpdateCategory({
    onSuccess: (response) => {
      toast.success("Category updated.");
      onClose();

      const newSlug = response?.data?.slug;

      // ONLY replace the URL if the slug changed AND we are currently on the details page
      const isOnDetailsPage = location.pathname.includes(
        `/categories/${category.slug}`,
      );
      if (newSlug && newSlug !== category.slug && isOnDetailsPage) {
        navigate(`/categories/${newSlug}`, { replace: true });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const onSubmit = (values: UpdateCategoryFormValues) => {
    const formData = new FormData();
    formData.append("Name", values.name.trim());

    if (values.image instanceof File) {
      formData.append("Image", values.image);
    }

    updateCategory({
      slug: category.slug,
      formData,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between p-6 bg-card">
        <div className="space-y-6">
          <SheetHeader className="space-y-1 p-0 text-left">
            <SheetTitle className="text-2xl font-bold text-sidebar-bg">
              Edit category
            </SheetTitle>
            <SheetDescription className="text-sm text-text-secondary">
              Update the category&apos;s name or image.
            </SheetDescription>
          </SheetHeader>

          <FormProvider {...methods}>
            <form
              id="edit-category-form"
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormInput<UpdateCategoryFormValues>
                label="Category name"
                name="name"
                placeholder="Enter category name"
                required
              />

              <FormImageUploader<UpdateCategoryFormValues>
                name="image"
                label="Category image"
                existingImageUrl={getImageUrl(
                  category?.imageUrl,
                  category?.updatedAt,
                )}
              />
            </form>
          </FormProvider>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-auto">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            disabled={isPending}
            className="bg-surface-mint text-sidebar-bg border-none hover:bg-surface-mint/80 font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-category-form"
            variant="primary"
            size="default"
            disabled={isPending || !isDirty}
            className="font-semibold cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Typography variant="body" className="font-semibold text-white">
              {isPending ? "Saving..." : "Save changes"}
            </Typography>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
