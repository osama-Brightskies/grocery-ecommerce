import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateProductApi({
  slug,
  formData,
}: {
  slug: string;
  formData: FormData;
}) {
  return await http.put(`/api/products/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function useUpdateProduct(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      options?.onSuccess?.();
    },
  });
}
