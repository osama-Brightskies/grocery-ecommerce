import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsApi } from "../api/getProducts";
import { getProductApi } from "../api/getProduct"; // Added import for full product details
import { createProductApi } from "../api/createProduct";
import { updateProductApi } from "../api/updateProduct";
import { deleteProductApi } from "../api/deleteProduct";
import { getCategoriesApi } from "@/features/categories/api/getCategories";
import type { Product } from "../products.types";
import { getTagsApi } from "@/features/tags/api/get-tags.api";

export function useProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const currentCursor = cursors[page] || null;

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", page, pageSize, currentCursor],
    queryFn: () => getProductsApi(pageSize, currentCursor ?? undefined),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi(100),
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags", 1, 100],
    queryFn: () => getTagsApi(1, 100),
  });

  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsSheetOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsSheetOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDeleteOpen(false);
      setActiveProduct(null);
    },
  });

  const products: Product[] = useMemo(
    () =>
      (productsData as { data?: { data?: Product[] } } | undefined)?.data
        ?.data ?? [],
    [productsData],
  );
  const totalPages = (
    productsData as
      | { data?: { pagination?: { hasNext?: boolean } } }
      | undefined
  )?.data?.pagination?.hasNext
    ? page + 1
    : page;

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

  const openCreate = () => {
    setActiveProduct(null);
    setIsSheetOpen(true);
  };

  const openEdit = async (product: Product) => {
    setActiveProduct(product);
    setIsSheetOpen(true);

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["product", product.slug],
        queryFn: () => getProductApi(product.slug),
      });

      const responseData = (response as { data?: unknown }).data;
      const nestedData =
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData
          ? responseData.data
          : undefined;
      const fullProduct = nestedData ?? responseData ?? response;

      if (fullProduct && typeof fullProduct === "object" && "name" in fullProduct) {
        setActiveProduct(fullProduct as Product);
      }
    } catch (error) {
      console.error("Failed to load full product details for edit", error);
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    const productSlug = (activeProduct as (Product & { slug?: string }) | null)
      ?.slug;
    if (productSlug) updateMutation.mutate({ slug: productSlug, formData });
    else createMutation.mutate(formData);
  };

  const deleteProduct = (slug: string) => deleteMutation.mutate(slug);
  const handlePageChange = (newPage: number) => {
    const pagination = (
      productsData as
        | { data?: { pagination?: { nextCursor?: string | null } } }
        | undefined
    )?.data?.pagination;
    if (newPage === page + 1) {
      setCursors((prev) => ({
        ...prev,
        [newPage]: pagination?.nextCursor ?? null,
      }));
    }
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    setCursors({ 1: null });
  };
  const viewDetails = (slug: string) => navigate(`/products/${slug}`);

  return {
    products,
    isLoading,
    isError,
    page,
    pageSize,
    totalPages,
    categoryOptions,
    availableTags,
    handlePageChange,
    handlePageSizeChange,
    isSheetOpen,
    setIsSheetOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    activeProduct,
    setActiveProduct,
    openCreate,
    openEdit,
    handleFormSubmit,
    deleteProduct,
    refetch,
    viewDetails,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}