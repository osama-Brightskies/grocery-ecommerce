import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductApi } from "../api/getProduct";
import { updateProductApi } from "../api/updateProduct";
import { deleteProductApi } from "../api/deleteProduct";
import { getCategoriesApi } from "@/features/categories/api/getCategories";
import { getTagsApi } from "@/features/tags/api/get-tags.api";

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
  console.log("🚀 ~ useProductDetails ~ tagsData:", tagsData);

  const product = (data as { data?: unknown } | undefined)?.data;

  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsSheetOpen(false);

      const updateResponse = response as {
        data?: { data?: { slug?: string }; slug?: string };
        slug?: string;
      };
      const newSlug =
        updateResponse.data?.data?.slug ||
        updateResponse.data?.slug ||
        updateResponse.slug;

      if (newSlug && newSlug !== slug) {
        navigate(`/products/${newSlug}`, { replace: true });
      } else {
        await queryClient.invalidateQueries({ queryKey: ["product", slug] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: async () => {
      // 1. Await the refresh FIRST
      await queryClient.invalidateQueries({ queryKey: ["products"] });

      // 2. THEN close the modal and navigate
      setIsDeleteOpen(false);
      navigate("/products", { replace: true });
    },
  });

  const categoryOptions = useMemo(() => {
    return (
      categoriesData?.data?.data?.map((c) => ({
        label: c.name,
        value: c.slug,
      })) || []
    );
  }, [categoriesData]);

  const availableTags = useMemo(() => {
    const rawTags = tagsData as unknown as {
      data?:
        | { data?: { name: string }[]; items?: { name: string }[] }
        | { name: string }[];
    };
    if (Array.isArray(rawTags?.data)) return rawTags.data.map((t) => t.name);
    if (Array.isArray(rawTags?.data?.data))
      return rawTags.data.data.map((t) => t.name);
    if (Array.isArray(rawTags?.data?.items))
      return rawTags.data.items.map((t) => t.name);
    return [];
  }, [tagsData]);

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
