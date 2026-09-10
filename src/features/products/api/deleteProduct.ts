import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteProductApi(slug: string) {
  return await http.delete(`/api/products/${slug}`);
}

export function useDeleteProduct(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductApi,
    onSuccess: (_, slug) => {
      queryClient.removeQueries({
        queryKey: ["product", slug],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      options?.onSuccess?.();
    },
  });
}
