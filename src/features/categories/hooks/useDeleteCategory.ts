import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryApi } from "../api/categories.api";
import type { ApiError } from "@/api/errors";

export type UseDeleteCategoryOptions = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};

export function useDeleteCategory(options?: UseDeleteCategoryOptions) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (slug) => deleteCategoryApi(slug),
    onSuccess: async (_, slug) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.removeQueries({ queryKey: ["category-detail", slug] }),
        queryClient.removeQueries({ queryKey: ["category-products", slug] }),
      ]);
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
