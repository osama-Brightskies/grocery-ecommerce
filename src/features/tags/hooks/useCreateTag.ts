import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTagApi } from "../api/create-tag.api";

export const useCreateTag = (options?: { onSuccess?: () => void; onError?: (err: Error) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};