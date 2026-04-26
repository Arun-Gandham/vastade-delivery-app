"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { cartApi } from "@/features/cart/cart.api";

export const useCartQuery = (shopId?: string) =>
  useQuery({
    queryKey: queryKeys.cart(shopId),
    queryFn: () => cartApi.get(shopId!),
    enabled: Boolean(shopId),
  });

export const useCartMutations = (shopId?: string) => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.cart(shopId) });

  return {
    addItem: useMutation({ mutationFn: cartApi.addItem, onSuccess: invalidate }),
    updateItem: useMutation({
      mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
        cartApi.updateItem(cartItemId, { quantity }),
      onSuccess: invalidate,
    }),
    removeItem: useMutation({ mutationFn: cartApi.removeItem, onSuccess: invalidate }),
    clear: useMutation({
      mutationFn: (currentShopId: string) => cartApi.clear(currentShopId),
      onSuccess: invalidate,
    }),
  };
};
