import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTagApi } from "../api/delete-tag.api";

export const useDeleteTag = (options?: { onSuccess?: () => void; onError?: (err: Error) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};