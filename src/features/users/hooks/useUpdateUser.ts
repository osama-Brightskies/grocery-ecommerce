import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "../api/users.api";
import type {
  UpdateUserPayload,
  UpdateUserResponse,
} from "../types/users.types";
import type { ApiError } from "@/api/errors";

type UseUpdateUserOptions = {
  onSuccess?: (data: UpdateUserResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useUpdateUser(options?: UseUpdateUserOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserPayload;
    }) => updateUserApi(userId, payload),

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      options?.onSuccess?.(data);
    },

    onError: (error: ApiError) => {
      options?.onError?.(error);
    },
  });
}
