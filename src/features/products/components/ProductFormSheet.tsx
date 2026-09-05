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
import { cn } from "@/lib/utils";

import type { Product } from "../types/products.types";
import { FormTextarea } from "@/components/ui/form-fields/FormTextarea";
import { FormInput } from "@/components/ui/form-fields/FormInput";
import { FormSelect } from "@/components/ui/form-fields/FormSelect";

// 1. Strict Zod Schema with manually defined error states
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
  imageFile: z.any().optional(), // Added for React Hook Form integration
});

type ProductFormValues = z.infer<typeof productSchema>;
type ProductFormInput = z.input<typeof productSchema>;

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
    defaultValues: {
      name: "",
      description: "",
      price: "" as unknown as number,
      stockQuantity: "" as unknown as number,
      categorySlug: "",
      altText: "",
      tags: [],
    },
  });

  useEffect(() => {
    const productDetails = activeProduct as
      | (Partial<Product> & {
          name: string;
          description: string;
          price: number;
          stockQuantity: number;
          categorySlug: string;
          altText?: string;
          tags?: string[];
        })
      | null;

    if (productDetails && isOpen) {
      methods.reset({
        name: productDetails.name || "",
        description:
          typeof productDetails.description === "string"
            ? productDetails.description
            : "",
        price: productDetails.price ?? "",
        stockQuantity: productDetails.stockQuantity ?? "",
        categorySlug: productDetails.categorySlug || "",
        altText: productDetails.altText || "",
        tags: productDetails.tags || [],
      });
    } else if (!productDetails && isOpen) {
      methods.reset({
        name: "",
        description: "",
        price: "" as unknown as number,
        stockQuantity: "" as unknown as number,
        categorySlug: "",
        altText: "",
        tags: [],
      });
    }
  }, [activeProduct, isOpen, methods]);

  const handleSubmitWrapper = (values: ProductFormValues) => {
    const fileInput = document.getElementById(
      "product-image",
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Description", values.description);
    formData.append("Price", values.price.toString());
    formData.append("StockQuantity", values.stockQuantity.toString());
    formData.append("CategorySlug", values.categorySlug);
    formData.append("AltText", values.altText || values.name);

    values.tags.forEach((tag, index) => {
      formData.append("TagNames", tag);
      formData.append("tagNames", tag); // 2. CamelCase fallback
      formData.append("Tags", tag); // 3. Exact Model property fallback
      formData.append(`TagNames[${index}]`, tag); // 4. Indexed array fallback
    });

    if (file) {
      formData.append("Image", file);
    }

    console.log("Submitting Tags:", values.tags);

    onSubmit(formData);
  };

  const imageError = methods.formState.errors.imageFile;

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

              <div className="space-y-1.5">
                <Typography
                  variant="label"
                  as="label"
                  className="text-text-secondary ml-0.5"
                >
                  Product Image {activeProduct ? "(Optional)" : "*"}
                </Typography>
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  {...methods.register("imageFile", {
                    required: !activeProduct
                      ? "An image is required for new products."
                      : false,
                  })}
                  className={cn(
                    "w-full h-11 px-3 py-2 rounded-lg border text-sm text-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-primary file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-surface-mint file:text-brand-primary hover:file:bg-surface-mint/80 transition-all cursor-pointer bg-white",
                    imageError
                      ? "border-status-danger-text focus:ring-status-danger-text"
                      : "border-border-input",
                  )}
                />
                {imageError && (
                  <Typography
                    variant="muted"
                    className="text-status-danger-text text-[12px] ml-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1"
                  >
                    {imageError.message as string}
                  </Typography>
                )}
              </div>
            </div>

            <SheetFooter className="px-6 py-5 border-t border-border-input bg-white flex justify-end gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-surface-mint text-brand-primary hover:bg-surface-mint/80 font-semibold px-6 border-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-medium text-white hover:bg-brand-primary font-semibold px-6"
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
