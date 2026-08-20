import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Typography } from "../../../components/Typography";
import { FormInput } from "../../../components/ui/form-fields/FormInput";
import { FormSelect } from "../../../components/ui/form-fields/FormSelect";
import { FormTextarea } from "../../../components/ui/form-fields/FormTextarea";
import {
  createProductSchema,
  type CreateProductFormTypes,
} from "./product.schema";

const CATEGORY_OPTIONS = [
  { label: "Fruits", value: "fruits" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Dairy & Eggs", value: "dairy" },
];

const UNIT_OPTIONS = [
  { label: "per kg", value: "kg" },
  { label: "per pc", value: "pc" },
  { label: "per box", value: "box" },
];

export default function FormEx() {
  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      unit: "",
      price: undefined,
      stock: undefined,
      description: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: CreateProductFormTypes) => {
    console.log("🚀 ~ Create Product Payload ~ data:", data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="rounded-xl border border-border-input bg-white p-8 shadow-sm space-y-6"
      >
        <div className="space-y-1">
          <Typography variant="h2" className="text-sidebar-bg font-semibold">
            Basic information
          </Typography>
          <Typography variant="muted" className="text-text-secondary">
            Keep product details clear and consistent.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput<CreateProductFormTypes>
            name="name"
            label="Product name"
            placeholder="e.g. Organic Bananas"
          />

          <FormInput<CreateProductFormTypes>
            name="sku"
            label="SKU"
            placeholder="e.g. FRU-BAN-001"
          />

          <FormSelect<CreateProductFormTypes>
            name="category"
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
          />

          <FormSelect<CreateProductFormTypes>
            name="unit"
            label="Unit"
            placeholder="Select unit"
            options={UNIT_OPTIONS}
          />

          <FormInput<CreateProductFormTypes>
            name="price"
            label="Price"
            type="number"
            step="0.01"
            placeholder="$0.00"
          />

          <FormInput<CreateProductFormTypes>
            name="stock"
            label="Stock quantity"
            type="number"
            placeholder="0"
          />
        </div>

        <FormTextarea<CreateProductFormTypes>
          name="description"
          label="Description"
          placeholder="Fresh organic bananas sourced locally."
        />

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="h-11 px-6 bg-brand-primary text-white rounded-[7px] font-medium text-sm hover:bg-brand-primary/90 transition-colors cursor-pointer"
          >
            Save Product
          </button>
        </div>
      </form>
    </FormProvider>
  );
}