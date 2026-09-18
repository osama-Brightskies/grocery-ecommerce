import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProductsApi, type ProductFilters } from "../api/getProducts";
import { getProductApi } from "../api/getProduct";
import { createProductApi } from "../api/createProduct";
import { updateProductApi } from "../api/updateProduct";
import { deleteProductApi } from "../api/deleteProduct";
import { getCategoriesApi } from "@/features/categories/api/getCategories";
import type { Product } from "../types/products.types";
import { getTagsApi } from "@/features/tags/api/get-tags.api";

// Clean helpers to safely extract data wrappers
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
  if (typeof error === "object" && error !== null) {
    const details = error as {
      message?: string;
      response?: { data?: { message?: string } };
    };
    return details.response?.data?.message || details.message || fallback;
  }
  return fallback;
};

export function useProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });

  const [filters, setFilters] = useState<ProductFilters>({
    Search: "",
    CategorySlug: "",
    SortBy: "",
    SortDir: "",
    InStock: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.Search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.Search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.Search]);

  const currentCursor = cursors[page] || null;

  const activeFilters = useMemo(
    () => ({
      ...filters,
      Search: debouncedSearch,
    }),
    [filters, debouncedSearch],
  );

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", page, pageSize, currentCursor, activeFilters],
    queryFn: () =>
      getProductsApi(pageSize, currentCursor ?? undefined, activeFilters),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi(100),
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags", 1, 100],
    queryFn: () => getTagsApi(1, 100),
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully.");
      setIsSheetOpen(false);
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(
          error,
          "Failed to create product. It may already exist.",
        ),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: async (response, variables) => {
      const newSlug = extractSlug(response) || variables.slug;

      queryClient.removeQueries({
        queryKey: ["product", variables.slug],
        exact: true,
      });
      if (newSlug && newSlug !== variables.slug) {
        queryClient.removeQueries({
          queryKey: ["product", newSlug],
          exact: true,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully.");
      setIsSheetOpen(false);
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
    onSuccess: async (_, deletedSlug) => {
      queryClient.removeQueries({
        queryKey: ["product", deletedSlug],
        exact: true,
      });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully.");
      setIsDeleteOpen(false);
      setActiveProduct(null);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete product."));
    },
  });

  // FRONTEND FALLBACK: Force the Out of Stock filter to work even if the backend ignores it
  const products: Product[] = useMemo(() => {
    let items =
      (productsData as { data?: { data?: Product[] } } | undefined)?.data
        ?.data ?? [];

    if (filters.InStock === true) {
      items = items.filter((p) => (p.stockQuantity ?? 0) > 0);
    } else if (filters.InStock === false) {
      items = items.filter((p) => (p.stockQuantity ?? 0) <= 0);
    }

    return items;
  }, [productsData, filters.InStock]);

  const totalPages = (
    productsData as
      { data?: { pagination?: { hasNext?: boolean } } } | undefined
  )?.data?.pagination?.hasNext
    ? page + 1
    : page;

  const categoryOptions = useMemo(() => {
    const categories = (
      categoriesData as { data?: { data?: { name: string; slug: string }[] } }
    )?.data?.data;
    return categories?.map((c) => ({ label: c.name, value: c.slug })) || [];
  }, [categoriesData]);

  const availableTags = useMemo(() => extractTags(tagsData), [tagsData]);

  const handleFilterChange = (
    key: keyof ProductFilters,
    value: ProductFilters[keyof ProductFilters],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setCursors({ 1: null });
  };

  const clearFilters = () => {
    setFilters({
      Search: "",
      CategorySlug: "",
      SortBy: "",
      SortDir: "",
      InStock: "",
    });
    setPage(1);
    setCursors({ 1: null });
  };

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

      if (
        fullProduct &&
        typeof fullProduct === "object" &&
        "name" in fullProduct
      ) {
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
        { data?: { pagination?: { nextCursor?: string | null } } } | undefined
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
    filters,
    handleFilterChange,
    clearFilters,
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
