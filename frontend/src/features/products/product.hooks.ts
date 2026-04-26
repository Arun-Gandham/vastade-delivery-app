"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { productApi } from "@/features/products/product.api";

export const useProductsQuery = (params?: Parameters<typeof productApi.list>[0]) =>
  useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => productApi.list(params),
  });

export const useProductQuery = (productId: string, shopId?: string) =>
  useQuery({
    queryKey: queryKeys.product(productId, shopId),
    queryFn: () => productApi.details(productId, shopId),
    enabled: Boolean(productId),
  });

export const useProductMutations = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: productApi.create,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    }),
    update: useMutation({
      mutationFn: ({ productId, payload }: { productId: string; payload: Parameters<typeof productApi.update>[1] }) =>
        productApi.update(productId, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    }),
    remove: useMutation({
      mutationFn: productApi.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    }),
  };
};
