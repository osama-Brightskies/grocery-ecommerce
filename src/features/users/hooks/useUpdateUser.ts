import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "../api/users.api";
import type {
  UpdateUserPayload,
  UpdateUserResponse,
} from "../types/users.types";
import type { ApiError } from "@/api/errors";

export type UseUpdateUserOptions = {
  onSuccess?: (data: UpdateUserResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useUpdateUser(options?: UseUpdateUserOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserResponse,
    ApiError,
    { userId: string; payload: UpdateUserPayload }
  >({
    mutationFn: ({ userId, payload }) => updateUserApi(userId, payload),
    onSuccess: async (data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({
          queryKey: ["user-detail", variables.userId],
        }),
      ]);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
