"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { shopApi } from "@/features/shops/shop.api";

export const useNearbyShopsQuery = (params?: { village?: string; pincode?: string }) =>
  useQuery({
    queryKey: queryKeys.shops,
    queryFn: () => shopApi.nearby(params),
  });

export const useShopQuery = (shopId: string) =>
  useQuery({
    queryKey: queryKeys.shop(shopId),
    queryFn: () => shopApi.details(shopId),
    enabled: Boolean(shopId),
  });

export const useShopMutations = () => {
  const queryClient = useQueryClient();
  return {
    updateOpenStatus: useMutation({
      mutationFn: ({ shopId, isOpen }: { shopId: string; isOpen: boolean }) =>
        shopApi.updateOpenStatus(shopId, isOpen),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.shop(variables.shopId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.shops });
      },
    }),
  };
};
