import { http } from "@/api";
import type {
  GetUsersParams,
  GetUsersResponse,
  GetUserDetailResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  GetUserActivitiesResponse,
} from "../types/users.types";

export const getUsersApi = (params: GetUsersParams) => {
  return http.get<GetUsersResponse>("/api/users", {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
};

export const getUserByIdApi = (userId: string) => {
  return http.get<GetUserDetailResponse>(`/api/users/${userId}`);
};

export const updateUserApi = (userId: string, payload: UpdateUserPayload) => {
  return http.put<UpdateUserResponse>(`/api/users/${userId}`, payload);
};

// Single User Activities API (Requires specific userId)
export const getUserActivitiesApi = (userId: string) => {
  return http.get<GetUserActivitiesResponse>("/api/user-activities", {
    params: {
      userId,
    },
  });
};

// All Users Activities API (Store-wide feed for dashboard, up to limit)
export const getAllUserActivitiesApi = (limit: number = 100) => {
  return http.get<GetUserActivitiesResponse>("/api/user-activities", {
    params: {
      Limit: limit,
      PageSize: limit,
    },
  });
};
