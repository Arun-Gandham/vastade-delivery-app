"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { orderApi } from "@/features/orders/order.api";

export const useOrdersQuery = (params?: Parameters<typeof orderApi.myOrders>[0]) =>
  useQuery({
    queryKey: queryKeys.orders(params),
    queryFn: () => orderApi.myOrders(params),
  });

export const useOrderQuery = (orderId: string) =>
  useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => orderApi.details(orderId),
    enabled: Boolean(orderId),
  });

export const usePlaceOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.placeOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(order.shopId) });
    },
  });
};

export const useShopOrdersQuery = (shopId: string) =>
  useQuery({
    queryKey: queryKeys.shopOrders(shopId),
    queryFn: () => orderApi.shopOrders(shopId),
    enabled: Boolean(shopId),
  });

export const useCaptainOrdersQuery = () =>
  useQuery({
    queryKey: queryKeys.captainActiveOrders,
    queryFn: orderApi.adminOrders,
    enabled: false,
  });

export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  return {
    cancelCustomerOrder: useMutation({
      mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
        orderApi.cancelByCustomer(orderId, reason),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    }),
    confirmShopOrder: useMutation({
      mutationFn: orderApi.acceptOrderByShop,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shop-orders"] }),
    }),
    readyForPickup: useMutation({
      mutationFn: orderApi.readyForPickup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shop-orders"] }),
    }),
    cancelShopOrder: useMutation({
      mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
        orderApi.cancelByShop(orderId, reason),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shop-orders"] }),
    }),
    assignCaptainByShop: useMutation({
      mutationFn: ({ orderId, captainId }: { orderId: string; captainId: string }) =>
        orderApi.assignCaptainByShop(orderId, captainId),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shop-orders"] }),
    }),
    adminAcceptOrder: useMutation({
      mutationFn: orderApi.adminAcceptOrder,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders }),
    }),
    adminReadyForPickup: useMutation({
      mutationFn: orderApi.adminReadyForPickup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders }),
    }),
    adminUpdateStatus: useMutation({
      mutationFn: ({ orderId, status, remarks }: { orderId: string; status: string; remarks?: string }) =>
        orderApi.adminUpdateStatus(orderId, status, remarks),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders }),
    }),
    adminAssignCaptain: useMutation({
      mutationFn: ({ orderId, captainId }: { orderId: string; captainId: string }) =>
        orderApi.adminAssignCaptain(orderId, captainId),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders }),
    }),
  };
};
