import { useState, useEffect, useCallback } from "react";
import type { ProductDetail } from "../types/products.types";
import { fetchProductById } from "../../../api/products.api";

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      if (!id) {
        if (isActive) {
          setIsLoading(false);
          setIsNotFound(true);
        }
        return;
      }

      if (isActive) {
        setIsLoading(true);
        setError(null);
        setIsNotFound(false);
      }

      try {
        const data = await fetchProductById(id);
        if (isActive) {
          setProduct(data as unknown as ProductDetail);
        }
      } catch (err: unknown) {
        if (!isActive) return;

        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        if (message === "Product not found") {
          setIsNotFound(true);
        } else {
          setError(message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isActive = false;
    };
  }, [id, retryCount]);

  return { product, isLoading, isNotFound, error, retry };
};
