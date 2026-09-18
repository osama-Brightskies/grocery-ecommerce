import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProductApi } from "../api/getProduct";
import { updateProductApi } from "../api/updateProduct";
import { deleteProductApi } from "../api/deleteProduct";
import { getCategoriesApi } from "@/features/categories/api/categories.api";
import { getTagsApi } from "@/features/tags/api/get-tags.api";
import type { SingleProductResponse } from "../types/products.types";

const extractSlug = (response: unknown): string | undefined => {
  const res = response as {
    data?: { data?: { slug?: string }; slug?: string };
    slug?: string;
  };
  return res?.data?.data?.slug || res?.data?.slug || res?.slug;
};

const extractTags = (tagsData: unknown): string[] => {
  const res = tagsData as {
    data?:
      | { data?: { name: string }[]; items?: { name: string }[] }
      | { name: string }[];
  };
  const target = res?.data;

  if (Array.isArray(target)) return target.map((t) => t.name);
  if (Array.isArray(target?.data)) return target.data.map((t) => t.name);
  if (Array.isArray(target?.items)) return target.items.map((t) => t.name);
  return [];
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object" && error !== null) {
    const message = (error as { response?: { data?: { message?: string } } })
      .response?.data?.message;
    if (message) return message;
  }

  return fallback;
};

export function useProductDetails(slug: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 1. Fetch Single Product (Clean Query, 30s staleTime)
  const { data, isLoading, isError } = useQuery<SingleProductResponse>({
    queryKey: ["product", slug],
    queryFn: () => getProductApi(slug),
    enabled: Boolean(slug),
    staleTime: 30 * 1000,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags", 1, 100],
    queryFn: () => getTagsApi(1, 100),
    staleTime: 5 * 60 * 1000,
  });

  const product = data?.data;

  // 2. Fast Mutation (Single roundtrip, zero double refetch)
  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: async (response) => {
      const newSlug = extractSlug(response) || slug;

      if (newSlug !== slug) {
        queryClient.removeQueries({ queryKey: ["product", slug], exact: true });
      }
      queryClient.setQueryData<SingleProductResponse>(
        ["product", newSlug],
        response as SingleProductResponse,
      );
      await queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product updated successfully.");
      setIsSheetOpen(false);

      if (newSlug !== slug) {
        navigate(`/products/${newSlug}`, { replace: true });
      }
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(
          error,
          "Failed to update product. It may already exist.",
        ),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["product", slug], exact: true });
      await queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product deleted successfully.");
      setIsDeleteOpen(false);
      navigate("/products", { replace: true });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete product."));
    },
  });

  const categoryOptions = useMemo(() => {
    const categories = (
      categoriesData as { data?: { data?: { name: string; slug: string }[] } }
    )?.data?.data;
    return categories?.map((c) => ({ label: c.name, value: c.slug })) || [];
  }, [categoriesData]);

  const availableTags = useMemo(() => extractTags(tagsData), [tagsData]);

  const handleFormSubmit = (formData: FormData) =>
    updateMutation.mutate({ slug, formData });
  const deleteProduct = () => deleteMutation.mutate(slug);

  return {
    product,
    isLoading,
    isError,
    navigate,
    categoryOptions,
    availableTags,
    isSheetOpen,
    setIsSheetOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    handleFormSubmit,
    deleteProduct,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
