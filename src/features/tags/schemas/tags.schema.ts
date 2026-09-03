import { z } from "zod";

export const tagFormSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required"),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;
