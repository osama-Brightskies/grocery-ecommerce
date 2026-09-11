import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryApi } from "../api/categories.api";
import type { UpdateCategoryResponse } from "../types/categories.types";
import type { ApiError } from "@/api/errors";

export type UseUpdateCategoryOptions = {
  onSuccess?: (data: UpdateCategoryResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useUpdateCategory(options?: UseUpdateCategoryOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCategoryResponse,
    ApiError,
    { slug: string; formData: FormData }
  >({
    mutationFn: ({ slug, formData }) => updateCategoryApi(slug, formData),

    onSuccess: async (data, variables) => {
      if (variables.slug !== data.data.slug) {
        queryClient.removeQueries({
          queryKey: ["category-detail", variables.slug],
          exact: true,
        });
        queryClient.removeQueries({
          queryKey: ["category-products", variables.slug],
        });
      }
      queryClient.setQueryData(["category-detail", data.data.slug], data);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });

      options?.onSuccess?.(data);
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
