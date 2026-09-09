import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductApi } from "../api/getProduct";
import { updateProductApi } from "../api/updateProduct";
import { deleteProductApi } from "../api/deleteProduct";
import { getCategoriesApi } from "@/features/categories/api/getCategories";
import { getTagsApi } from "@/features/tags/api/get-tags.api";

// Clean helper to safely extract a slug from various response wrapper shapes
const extractSlug = (response: unknown): string | undefined => {
  const res = response as {
    data?: { data?: { slug?: string }; slug?: string };
    slug?: string;
  };
  return res?.data?.data?.slug || res?.data?.slug || res?.slug;
};

// Clean helper to extract tag names regardless of pagination/wrapping
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

export function useProductDetails(slug: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductApi(slug),
    enabled: !!slug,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi(100),
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags", 1, 100],
    queryFn: () => getTagsApi(1, 100),
  });

  const product = (data as { data?: unknown } | undefined)?.data;

  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: async (response) => {
      const newSlug = extractSlug(response);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["product", slug] }),
        ...(newSlug && newSlug !== slug
          ? [queryClient.invalidateQueries({ queryKey: ["product", newSlug] })]
          : []),
      ]);

      await refetch();
      setIsSheetOpen(false);

      if (newSlug && newSlug !== slug) {
        navigate(`/products/${newSlug}`, { replace: true });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["product", slug] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });

      setIsDeleteOpen(false);
      navigate("/products", { replace: true });
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
    refetch,
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
