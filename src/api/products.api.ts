const API_BASE_URL = "http://63.183.213.35:5223/api";

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord {
  return typeof value === "object" && value !== null
    ? (value as ApiRecord)
    : {};
}

function asRecordList(value: unknown): ApiRecord[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is ApiRecord => typeof item === "object" && item !== null,
      )
    : [];
}

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products?InStock=true`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: ApiRecord = asRecord(await response.json());

    let rawList: ApiRecord[] = [];
    if (Array.isArray(json)) {
      rawList = asRecordList(json);
    } else if (json?.data) {
      if (Array.isArray(json.data)) rawList = asRecordList(json.data);
      else {
        const nestedData = asRecord(json.data).data;
        if (Array.isArray(nestedData)) rawList = asRecordList(nestedData);
      }
    }

    const mappedData = rawList.map((item: ApiRecord) => ({
      ...item,
      id: String(item.slug || item.id || ""),
      slug: String(item.slug || item.id || ""),
      name: String(item.name || item.Name || "Untitled"),
      brand: String(item.brand || item.Brand || "—"),
      category: String(
        item.categoryName ||
          item.CategoryName ||
          asRecord(item.category).name ||
          asRecord(item.Category).Name ||
          item.category ||
          item.Category ||
          (item.categoryId ? `Category ${item.categoryId}` : "General"),
      ),
      price: Number(item.price ?? item.Price ?? 0),
      stock: Number(
        item.stockQuantity ?? item.StockQuantity ?? item.stock ?? 0,
      ),
      image: String(item.productImageUrl || item.image || ""),
    }));

    return {
      data: mappedData,
      total: mappedData.length,
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { data: [], total: 0 };
  }
}

export async function fetchProductById(slug: string) {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`);
  if (!response.ok) throw new Error("Not found");
  const json = await response.json();
  const item = json.data || json;

  return {
    id: String(item.slug || item.id || slug),
    slug: String(item.slug || item.id || slug),
    name: String(item.name || item.Name || ""),
    description: String(item.description || item.Description || ""),
    brand: String(item.brand || item.Brand || ""),
    price: Number(item.price ?? item.Price ?? 0),
    stock: Number(item.stockQuantity ?? item.StockQuantity ?? item.stock ?? 0),
    categoryId: Number(item.categoryId ?? item.CategoryId ?? 0),
    category: String(
      item.categoryName ||
        item.CategoryName ||
        item.category?.name ||
        item.Category?.Name ||
        item.category ||
        item.Category ||
        "General",
    ),
    image: String(item.productImageUrl || item.image || ""),
    altText: String(item.altText || item.AltText || ""),
    tags: Array.isArray(item.tags) ? item.tags : [],
    createdAt: String(item.createdAt || item.CreatedDate || "N/A"),
    lastUpdated: String(item.lastUpdated || item.UpdatedDate || "N/A"),
  };
}

export async function deleteProduct(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

export async function createProduct(formData: FormData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Create Rejected:", errorText);
    throw new Error(`Server Error: ${errorText}`);
  }
}

export async function updateProduct(
  slug: string,
  formData: FormData,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Update Rejected:", errorText);
    throw new Error(`Server Error: ${errorText}`);
  }
}

export async function fetchTags() {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok) throw new Error("Failed to fetch tags");
    const json = await response.json();

    if (Array.isArray(json)) return json;
    if (json?.data && Array.isArray(json.data)) return json.data;
    if (json?.data?.data && Array.isArray(json.data.data))
      return json.data.data;

    return [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}
