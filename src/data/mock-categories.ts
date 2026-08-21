export interface Category {
  id: string;
  name: string;
  productCount: string;
  letter: string;
}

export const mockCategories: Category[] = [
  { id: "1", name: "Fruits", productCount: "126", letter: "F" },
  { id: "2", name: "Vegetables", productCount: "84 products", letter: "V" },
  { id: "3", name: "Dairy", productCount: "62 products", letter: "D" },
  { id: "4", name: "Bakery", productCount: "48 products", letter: "B" },
  { id: "5", name: "Pantry", productCount: "210 products", letter: "P" },
  { id: "6", name: "Beverages", productCount: "96 products", letter: "B" },
];
