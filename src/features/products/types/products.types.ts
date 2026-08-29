export interface ProductItem {
  id: string | number;
  Name?: string;
  name?: string;
  Description?: string;
  description?: string;
  Brand?: string;
  brand?: string;
  Price?: number;
  price?: number;
  StockQuantity?: number;
  stockQuantity?: number;
  CategoryId?: number;
  categoryId?: number;
  Image?: string;
  image?: string;
  AltText?: string;
  altText?: string;
  TagIds?: number[];
  tagIds?: number[];
}

export interface ProductDetail {
  id: string | number;
  Name: string;
  Description: string;
  Brand: string;
  Price: number;
  StockQuantity: number;
  AltText?: string;
  CategoryId: number;
  Image: string;
  TagIds: number[];
}
