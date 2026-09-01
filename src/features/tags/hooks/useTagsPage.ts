import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGetTags } from "./useGetTags";
import { useCreateTag } from "./useCreateTag";
import { useUpdateTag } from "./useUpdateTag";
import { useDeleteTag } from "./useDeleteTag";
import type { Tag } from "../types/tags.types";

interface ApiTagResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?:
    | {
        data?: Tag[];
        items?: Tag[];
        pagination?: {
          currentPage?: number;
          pageSize?: number;
          totalCount?: number;
          totalPages?: number;
          hasNext?: boolean;
          hasPrevious?: boolean;
        };
      }
    | Tag[];
}

export function useTagsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const responseObj = tagsData as ApiTagResponse | undefined;

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
    navigate,
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
    fileInputRef,
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
