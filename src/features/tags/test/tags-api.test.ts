import { afterEach, describe, expect, it, vi } from "vitest";
import { http } from "@/api/http";
import { getTagsApi } from "../api/get-tags.api";
import { createTagApi } from "../api/create-tag.api";
import { updateTagApi } from "../api/update-tag.api";
import { deleteTagApi } from "../api/delete-tag.api";

describe("tags API contracts", () => {
  afterEach(() => vi.restoreAllMocks());
  it("uses the expected endpoints and payloads", async () => {
    vi.spyOn(http, "get").mockResolvedValue(undefined);
    vi.spyOn(http, "post").mockResolvedValue(undefined);
    vi.spyOn(http, "put").mockResolvedValue(undefined);
    vi.spyOn(http, "delete").mockResolvedValue(undefined);
    await getTagsApi(2, 25);
    await createTagApi({ name: "Organic" });
    await updateTagApi("organic", { name: "Fresh" });
    await deleteTagApi("organic");
    expect(http.get).toHaveBeenCalledWith("/api/tags", {
      params: { PageNumber: 2, PageSize: 25 },
    });
    expect(http.post).toHaveBeenCalledWith("/api/tags", { name: "Organic" });
    expect(http.put).toHaveBeenCalledWith("/api/tags/organic", {
      name: "Fresh",
    });
    expect(http.delete).toHaveBeenCalledWith("/api/tags/organic");
  });
});
