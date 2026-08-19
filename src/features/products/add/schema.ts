import z from "zod";

export const schema = z.object({
  car: z.string().min(1, { error: "car field is required" }),
  color: z.string().min(1, { error: "car field is required" }),
  name: z.string().min(1, { error: "car field is required" }),
  key: z.string().min(1, { error: "car field is required" }),
});

export type FormTypes = z.infer<typeof schema>;
