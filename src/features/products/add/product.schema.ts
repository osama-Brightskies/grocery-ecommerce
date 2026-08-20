import { z } from "zod";

const SKU_REGEX = /^[A-Z0-9-]+$/;

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),

  sku: z
    .string()
    .trim()
    .min(3, "SKU must be at least 3 characters")
    .max(20, "SKU must not exceed 20 characters")
    .regex(
      SKU_REGEX,
      "SKU can only contain uppercase letters, numbers, and hyphens (e.g. FRU-BAN-001)",
    )
    .transform((val) => val.toUpperCase().trim()),

  category: z.string().min(1, "Please select a category"),
  unit: z.string().min(1, "Please select a unit"),

  // Preprocess handles undefined & "" by turning them into undefined for required checks
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.coerce
      .number({ message: "Price is required" })
      .gt(0, "Price must be greater than $0"),
  ),

  stock: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.coerce
      .number({ message: "Stock quantity is required" })
      .min(0, "Stock cannot be negative"),
  ),

  description: z.string().optional(),
});

export type CreateProductFormTypes = z.infer<typeof createProductSchema>;
