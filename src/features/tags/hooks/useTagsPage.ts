import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Tag } from "../types/tags.types";
import { useGetTags } from "./useGetTags";
import { useCreateTag } from "./useCreateTag";
import { useUpdateTag } from "./useUpdateTag";
import { useDeleteTag } from "./useDeleteTag";

export function useTagsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
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
      setIsSheetOpen(false);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      refetch();
    },
  });

  const updateMutation = useUpdateTag({
    onSuccess: () => {
      setIsSheetOpen(false);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      refetch();
    },
  });

  const deleteMutation = useDeleteTag({
    onSuccess: () => {
      setIsDeleteOpen(false);
      setActiveTag(null);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      refetch();
    },
  });

  const responseObj = tagsData as unknown as {
    data?:
      | Tag[]
      | {
          data?: Tag[];
          items?: Tag[];
          pagination?: { totalPages?: number };
        };
  } | undefined;

  let tags: Tag[] = [];
  let totalPages = 1;

  if (responseObj?.data) {
    if (Array.isArray(responseObj.data)) {
      tags = responseObj.data;
    } else {
      tags = responseObj.data.data || responseObj.data.items || [];
      totalPages = responseObj.data.pagination?.totalPages || 1;
    }
  } else if (Array.isArray(tagsData)) {
    tags = tagsData;
  }

  const openCreate = () => {
    setActiveTag(null);
    setIsSheetOpen(true);
  };

  const openEdit = (tag: Tag) => {
    setActiveTag(tag);
    setIsSheetOpen(true);
  };

  const handleFormSubmit = (values: { name: string; description?: string }) => {
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

  return {
    tags,
    isLoading,
    isError,
    page,
    totalPages,
    handlePageChange,
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