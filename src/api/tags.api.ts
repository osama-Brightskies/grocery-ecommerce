const API_BASE_URL = "http://63.183.213.35:5223/api";

type ApiObject = Record<string, unknown>;

const isApiObject = (value: unknown): value is ApiObject =>
  typeof value === "object" && value !== null;

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("adminToken");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

export async function fetchTagsPaginated(page: number = 1, limit: number = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tags?PageNumber=${page}&PageSize=${limit}`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const json = await response.json();

    let rawList: ApiObject[] = [];
    if (Array.isArray(json)) {
      rawList = json.filter(isApiObject);
    } else if (isApiObject(json) && json.data) {
      if (Array.isArray(json.data)) {
        rawList = json.data.filter(isApiObject);
      } else if (isApiObject(json.data) && Array.isArray(json.data.data)) {
        rawList = json.data.data.filter(isApiObject);
      }
    }

    const mappedData = rawList.map((item) => ({
      ...item,
      id: String(item.id || item.Id || item.slug || ""),
      slug: String(item.slug || item.Slug || item.id || ""),
      name: String(item.name || item.Name || "Untitled Tag"),
    }));

    return {
      data: mappedData,
      total:
        isApiObject(json) &&
        isApiObject(json.pagination) &&
        typeof json.pagination.totalCount === "number"
          ? json.pagination.totalCount
          : isApiObject(json) && typeof json.totalCount === "number"
            ? json.totalCount
            : mappedData.length,
    };
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return { data: [], total: 0 };
  }
}

export async function createTag(name: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server Error: ${errorText}`);
  }
}

export async function updateTag(slug: string, name: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tags/${slug}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server Error: ${errorText}`);
  }
}

export async function deleteTag(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tags/${slug}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to delete tag");
}
