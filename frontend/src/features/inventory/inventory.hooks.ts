"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { inventoryApi } from "@/features/inventory/inventory.api";

export const useInventoryQuery = (shopId: string) =>
  useQuery({
    queryKey: queryKeys.shopInventory(shopId),
    queryFn: () => inventoryApi.list(shopId),
    enabled: Boolean(shopId),
  });

export const useInventoryMutations = (shopId: string) => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.shopInventory(shopId) });

  return {
    update: useMutation({
      mutationFn: ({
        productId,
        payload,
      }: {
        productId: string;
        payload: { availableStock: number; lowStockAlert: number; isAvailable: boolean };
      }) => inventoryApi.update(shopId, productId, payload),
      onSuccess: invalidate,
    }),
    adjust: useMutation({
      mutationFn: ({
        productId,
        payload,
      }: {
        productId: string;
        payload: { quantity: number; adjustmentType: string; remarks: string };
      }) => inventoryApi.adjust(shopId, productId, payload),
      onSuccess: invalidate,
    }),
  };
};
