import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { useCreateCategory } from "../hooks/useCreateCategory";
import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "../schemas/categories.schema";

export type CreateCategorySheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateCategorySheet({
  isOpen,
  onClose,
}: CreateCategorySheetProps) {
  const methods = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const { mutate: createCategory, isPending } = useCreateCategory({
    onSuccess: () => {
      toast.success("Category created.");
      methods.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const onSubmit = (values: CreateCategoryFormValues) => {
    const formData = new FormData();
    formData.append("Name", values.name.trim());
    formData.append("Image", values.image);

    createCategory(formData);
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between p-6 bg-card">
        <div className="space-y-6">
          <SheetHeader className="space-y-1 p-0 text-left">
            <SheetTitle className="text-2xl font-bold text-sidebar-bg">
              Add category
            </SheetTitle>
            <SheetDescription className="text-sm text-text-secondary">
              Create a new product category.
            </SheetDescription>
          </SheetHeader>

          <FormProvider {...methods}>
            <form
              id="create-category-form"
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormInput<CreateCategoryFormValues>
                label="Category name"
                name="name"
                placeholder="Enter category name"
                required
              />

              <FormImageUploader<CreateCategoryFormValues>
                name="image"
                label="Category image"
                required
              />
            </form>
          </FormProvider>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-auto">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleClose}
            disabled={isPending}
            className="bg-surface-mint text-sidebar-bg border-none hover:bg-surface-mint/80 font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="create-category-form"
            variant="primary"
            size="default"
            disabled={isPending}
            className="font-semibold cursor-pointer shadow-xs"
          >
            <Typography variant="body" className="font-semibold text-white">
              {isPending ? "Creating..." : "Create category"}
            </Typography>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
