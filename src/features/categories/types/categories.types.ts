export type Category = {
  name: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
};

export type CategoryProduct = {
  name: string;
  slug: string;
  stockQuantity: number;
  altText?: string;
  categorySlug: string;
  price: number;
  productImageUrl: string;
};

export type CursorPaginationMeta = {
  nextCursor: string | null;
  hasNext: boolean;
  pageSize: number;
};

export type GetCategoriesParams = {
  limit?: number;
  cursor?: string;
};

export type GetCategoriesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Category[];
    pagination?: CursorPaginationMeta;
  };
};

export type GetCategoryDetailResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category;
};

export type GetCategoryProductsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: CategoryProduct[];
    pagination?: CursorPaginationMeta;
  };
};

export type CreateCategoryResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category;
};

export type UpdateCategoryResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category;
};
