// The core Product model
export interface Product {
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  productImageUrl?: string;
  isFavorited: boolean;
  altText?: string;
  creationDate: string;
  categorySlug: string;
  tags: string[];
  updatedAt?: string; // <-- ADDED THIS!
}

export interface PaginationMetadata {
  hasNext: boolean;
  nextCursor: string | null;
}

export interface SingleProductResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Product;
}

export interface PaginatedProductsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Product[];
    pagination: PaginationMetadata;
  };
}
