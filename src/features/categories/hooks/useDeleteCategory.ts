import { useMutation } from "@tanstack/react-query";
import { deleteCategoryApi } from "../api/categories.api";
import type { ApiError } from "@/api/errors";

export type UseDeleteCategoryOptions = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};

export function useDeleteCategory(options?: UseDeleteCategoryOptions) {
  return useMutation<void, ApiError, string>({
    mutationFn: (slug) => deleteCategoryApi(slug),

    onSuccess: () => {
      options?.onSuccess?.();
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
