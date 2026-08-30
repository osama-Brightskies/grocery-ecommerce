import { http } from "@/api";
import type {
  GetUsersParams,
  GetUsersResponse,
  GetUserDetailResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  GetUserActivitiesResponse,
} from "../types/users.types";

export const getUsersApi = (params?: GetUsersParams) => {
  return http.get<GetUsersResponse>("/api/users", {
    params: {
      PageNumber: params?.pageNumber ?? 1,
      PageSize: params?.pageSize ?? 10,
    },
  });
};

export const getUserByIdApi = (userId: string) => {
  return http.get<GetUserDetailResponse>(`/api/users/${userId}`);
};

export const updateUserApi = (userId: string, payload: UpdateUserPayload) => {
  return http.put<UpdateUserResponse>(`/api/users/${userId}`, payload);
};

export const getUserActivitiesApi = (userId?: string) => {
  return http.get<GetUserActivitiesResponse>("/api/user-activities", {
    params: userId ? { userId } : undefined,
  });
};
