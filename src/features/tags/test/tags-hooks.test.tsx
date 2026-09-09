import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as getApi from "../api/get-tags.api";
import * as createApi from "../api/create-tag.api";
import * as updateApi from "../api/update-tag.api";
import * as deleteApi from "../api/delete-tag.api";
import { useGetTags } from "../hooks/useGetTags";
import { useCreateTag } from "../hooks/useCreateTag";
import { useUpdateTag } from "../hooks/useUpdateTag";
import { useDeleteTag } from "../hooks/useDeleteTag";
import { tagFormSchema } from "../schemas/tags.schema";

vi.mock("../api/get-tags.api");
vi.mock("../api/create-tag.api");
vi.mock("../api/update-tag.api");
vi.mock("../api/delete-tag.api");
function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe("tag hooks and schema", () => {
  beforeEach(() => vi.clearAllMocks());
  it("loads a requested tags page", async () => {
    vi.mocked(getApi.getTagsApi).mockResolvedValue({
      data: { data: [], pagination: { totalPages: 1, totalCount: 0 } },
    } as never);
    const { result } = renderHook(() => useGetTags(3, 20), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getApi.getTagsApi).toHaveBeenCalledWith(3, 20);
  });
  it("passes mutation payloads through", async () => {
    vi.mocked(createApi.createTagApi).mockResolvedValue(undefined as never);
    vi.mocked(updateApi.updateTagApi).mockResolvedValue(undefined as never);
    vi.mocked(deleteApi.deleteTagApi).mockResolvedValue(undefined as never);
    const { result } = renderHook(
      () => ({
        create: useCreateTag(),
        update: useUpdateTag(),
        remove: useDeleteTag(),
      }),
      { wrapper: wrapper() },
    );
    act(() => {
      result.current.create.mutate({ name: "Organic" });
      result.current.update.mutate({ slug: "organic", name: "Fresh" });
      result.current.remove.mutate("organic");
    });
    await waitFor(() =>
      expect(
        result.current.create.isSuccess &&
          result.current.update.isSuccess &&
          result.current.remove.isSuccess,
      ).toBe(true),
    );
    expect(vi.mocked(createApi.createTagApi).mock.calls[0][0]).toEqual({
      name: "Organic",
    });
    expect(updateApi.updateTagApi).toHaveBeenCalledWith("organic", {
      name: "Fresh",
    });
    expect(vi.mocked(deleteApi.deleteTagApi).mock.calls[0][0]).toBe("organic");
  });
  it("validates and trims tag names", () => {
    expect(tagFormSchema.parse({ name: "  Fresh  " }).name).toBe("Fresh");
    expect(tagFormSchema.safeParse({ name: "   " }).success).toBe(false);
  });
});
