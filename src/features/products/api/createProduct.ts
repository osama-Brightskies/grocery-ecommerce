import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createProductApi(formData: FormData) {
  return await http.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function useCreateProduct(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      options?.onSuccess?.();
    },
  });
}
