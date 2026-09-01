import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTagApi } from "../api/update-tag.api";

interface UpdateTagPayload {
  slug: string;
  name: string;
  description?: string;
}

export const useUpdateTag = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, ...data }: UpdateTagPayload) =>
      updateTagApi(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      options?.onSuccess?.();
    },
  });
};
