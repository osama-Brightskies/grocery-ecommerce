import { useState } from "react";
import { toast } from "sonner";
import type { Tag } from "../types/tags.types";
import { useGetTags } from "./useGetTags";
import { useCreateTag } from "./useCreateTag";
import { useUpdateTag } from "./useUpdateTag";
import { useDeleteTag } from "./useDeleteTag";

export function useTagsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);

  const {
    data: tagsData,
    isLoading,
    isError,
    refetch,
  } = useGetTags(page, pageSize);

  const createMutation = useCreateTag({
    onSuccess: () => {
      toast.success("Tag created successfully");
      setIsSheetOpen(false);
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create tag",
      );
    },
  });

  const updateMutation = useUpdateTag({
    onSuccess: () => {
      toast.success("Tag updated successfully");
      setIsSheetOpen(false);
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update tag",
      );
    },
  });

  const deleteMutation = useDeleteTag({
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      setIsDeleteOpen(false);
      setActiveTag(null);
    },
  });

  const tags: Tag[] = tagsData?.data?.data ?? [];
  const totalPages = tagsData?.data?.pagination?.totalPages;
  const totalCount = tagsData?.data?.pagination?.totalCount;

  const openCreate = () => {
    setActiveTag(null);
    setIsSheetOpen(true);
  };

  const openEdit = (tag: Tag) => {
    setActiveTag(tag);
    setIsSheetOpen(true);
  };

  const handleFormSubmit = (values: { name: string; description?: string }) => {
    // 1. Prevent duplicate tags client-side
    const isDuplicate = tags.some(
      (t) =>
        t.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
        t.slug !== activeTag?.slug,
    );

    if (isDuplicate) {
      toast.error("A tag with this name already exists.");
      return;
    }

    // 2. Proceed with mutation if unique
    if (activeTag?.slug) {
      updateMutation.mutate({ slug: activeTag.slug, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  const deleteTag = (slug: string) => {
    deleteMutation.mutate(slug);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return {
    tags,
    isLoading,
    isError,
    page,
    pageSize,
    totalPages,
    totalCount,
    handlePageChange,
    handlePageSizeChange,
    isSheetOpen,
    setIsSheetOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    activeTag,
    setActiveTag,
    openCreate,
    openEdit,
    handleFormSubmit,
    deleteTag,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
