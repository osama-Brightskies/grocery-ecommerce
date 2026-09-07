import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryApi } from "../api/categories.api";
import type { CreateCategoryResponse } from "../types/categories.types";
import type { ApiError } from "@/api/errors";

export type UseCreateCategoryOptions = {
  onSuccess?: (data: CreateCategoryResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useCreateCategory(options?: UseCreateCategoryOptions) {
  const queryClient = useQueryClient();

  return useMutation<CreateCategoryResponse, ApiError, FormData>({
    mutationFn: (formData) => createCategoryApi(formData),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
