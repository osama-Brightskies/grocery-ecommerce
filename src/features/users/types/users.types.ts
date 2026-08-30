export type User = {
  guid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

export type PaginationMeta = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetUsersParams = {
  pageNumber?: number;
  pageSize?: number;
};

export type GetUsersResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: User[];
    pagination: PaginationMeta;
  };
};

export type GetUserDetailResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
};

export type UpdateUserPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
};

export type UpdateUserResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
};

export type UserActivity = {
  id: string;
  action: string;
  targetName: string;
  timestamp: string;
};

export type GetUserActivitiesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserActivity[];
};
