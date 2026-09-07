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
}

// Pagination metadata returned by the cursor-based API
export interface PaginationMetadata {
  hasNext: boolean;
  nextCursor: string | null;
}

// Standard API Wrapper for a single product (GET /api/products/{slug})
export interface SingleProductResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Product;
}

// Standard API Wrapper for the paginated product list (GET /api/products)
export interface PaginatedProductsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Product[];
    pagination: PaginationMetadata;
  };
}
