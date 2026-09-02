export interface Tag {
  slug: string;
  name: string;
}

export interface GetTagsParams {
  PageNumber?: number;
  PageSize?: number;
}

export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetTagsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Tag[];
    pagination: Pagination;
  };
};
