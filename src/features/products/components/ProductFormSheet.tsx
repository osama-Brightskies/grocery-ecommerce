import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/shared/Typography";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn, getImageUrl } from "@/lib/utils";

import { FormTextarea } from "@/components/ui/form-fields/FormTextarea";
import { FormInput } from "@/components/ui/form-fields/FormInput";
import { FormSelect } from "@/components/ui/form-fields/FormSelect";
import { FormImageUploader } from "@/components/ui/form-fields/FormImageUploader";
import type { Product } from "../types/products.types";

const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  price: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Price is required",
    })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Price must be a valid number" })
    .refine((val) => val >= 0, { message: "Price cannot be negative" }),
  stockQuantity: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Stock is required",
    })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && Number.isInteger(val), {
      message: "Stock must be a whole number",
    })
    .refine((val) => val >= 0, { message: "Stock cannot be negative" }),
  categorySlug: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().min(1, "Description is required"),
  altText: z.string().optional(),
  tags: z.array(z.string()).default([]),
  imageFile: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;
type ProductFormInput = z.input<typeof productSchema>;

const EMPTY_PRODUCT_FORM: ProductFormInput = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  categorySlug: "",
  altText: "",
  tags: [],
  imageFile: undefined,
};

type SelectOption = {
  label: string;
  value: string;
};

export function ProductFormSheet({
  isOpen,
  onClose,
  activeProduct,
  onSubmit,
  isSubmitting,
  categoryOptions,
  availableTags,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeProduct: Product | null;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
  categoryOptions: SelectOption[];
  availableTags: string[];
}) {
  const methods = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY_PRODUCT_FORM,
  });

  useEffect(() => {
    if (!isOpen) return;

    methods.reset(
      activeProduct
        ? {
            name: activeProduct.name,
            description: activeProduct.description,
            price: activeProduct.price,
            stockQuantity: activeProduct.stockQuantity,
            categorySlug: activeProduct.categorySlug,
            altText: activeProduct.altText ?? "",
            tags: activeProduct.tags,
            imageFile: undefined,
          }
        : EMPTY_PRODUCT_FORM,
    );
  }, [activeProduct, isOpen, methods]);

  const handleSubmitWrapper = (values: ProductFormValues) => {
    if (!activeProduct && !values.imageFile) {
      methods.setError("imageFile", {
        type: "manual",
        message: "An image is required for new products.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Description", values.description);
    formData.append("Price", values.price.toString());
    formData.append("StockQuantity", values.stockQuantity.toString());
    formData.append("CategorySlug", values.categorySlug);
    formData.append("AltText", values.altText || values.name);

    // 🪄 Clean TagNames append (Zero duplicate spam)
    values.tags.forEach((tag) => {
      formData.append("TagNames", tag);
    });

    if (values.imageFile instanceof File) {
      formData.append("Image", values.imageFile);
    }

    onSubmit(formData);
  };

  const existingImageUrl = activeProduct?.productImageUrl
    ? getImageUrl(activeProduct.productImageUrl, activeProduct.updatedAt)
    : undefined;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="overflow-y-auto sm:max-w-lg p-0 bg-white"
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmitWrapper)}
            className="flex flex-col h-full"
          >
            <SheetHeader className="px-6 py-6 border-b border-border-input bg-white">
              <SheetTitle className="text-2xl font-bold text-sidebar-bg">
                {activeProduct ? "Edit Product" : "Create Product"}
              </SheetTitle>
              <SheetDescription className="text-sm text-text-secondary mt-1">
                {activeProduct
                  ? "Update the product details below. Leave image blank to keep current."
                  : "Fill in the details to add a new product to your catalog."}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 p-6 space-y-6 bg-white">
              <FormInput
                name="name"
                label="Product Name"
                type="text"
                placeholder="e.g. Organic Bananas"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="price"
                  label="Price ($)"
                  type="number"
                  step="0.01"
                />
                <FormInput
                  name="stockQuantity"
                  label="Stock Quantity"
                  type="number"
                />
              </div>

              <FormSelect
                name="categorySlug"
                label="Category"
                options={categoryOptions}
                placeholder="Select a category"
              />

              <FormInput
                name="altText"
                label="Image Alt Text (Optional)"
                type="text"
                placeholder="Description of image"
              />

              <FormTextarea
                name="description"
                label="Description"
                placeholder="Detailed product description..."
                rows={4}
              />

              <Controller
                name="tags"
                control={methods.control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Typography
                      variant="label"
                      as="label"
                      className="text-text-secondary ml-0.5"
                    >
                      Assign Tags
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.length === 0 ? (
                        <Typography
                          variant="muted"
                          className="text-sm italic mt-1"
                        >
                          No tags available.
                        </Typography>
                      ) : (
                        availableTags.map((tag) => {
                          const selectedTags = field.value ?? [];
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  field.onChange(
                                    selectedTags.filter(
                                      (t: string) => t !== tag,
                                    ),
                                  );
                                } else {
                                  field.onChange([...selectedTags, tag]);
                                }
                              }}
                              className={cn(
                                "px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 cursor-pointer",
                                isSelected
                                  ? "bg-surface-mint border-brand-primary text-brand-primary font-semibold"
                                  : "bg-white border-border-input text-text-secondary hover:border-brand-primary/50",
                              )}
                            >
                              {tag}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              />

              <FormImageUploader
                name="imageFile"
                label="Product Image"
                required={!activeProduct}
                existingImageUrl={existingImageUrl}
              />
            </div>

            {/* Symmetrical Button Footer */}
            <SheetFooter className="px-6 py-5 border-t border-border-input bg-white flex flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-surface-mint text-sidebar-bg border-none hover:bg-surface-mint/80 font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="default"
                disabled={isSubmitting}
                className="font-semibold cursor-pointer shadow-xs"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
