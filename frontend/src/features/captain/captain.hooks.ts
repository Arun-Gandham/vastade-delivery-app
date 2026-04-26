"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { captainApi } from "@/features/captain/captain.api";

export const useCaptainProfileQuery = () =>
  useQuery({
    queryKey: queryKeys.captainProfile,
    queryFn: captainApi.getMe,
  });

export const useCaptainOrdersDataQuery = () =>
  useQuery({
    queryKey: queryKeys.captainOrders,
    queryFn: captainApi.orders,
  });

export const useCaptainMutations = () => {
  const queryClient = useQueryClient();

  return {
    updateOnlineStatus: useMutation({
      mutationFn: captainApi.updateOnlineStatus,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainProfile }),
    }),
    updateLocation: useMutation({
      mutationFn: captainApi.updateLocation,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainProfile }),
    }),
    acceptOrder: useMutation({
      mutationFn: captainApi.acceptOrder,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    rejectOrder: useMutation({
      mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
        captainApi.rejectOrder(orderId, reason),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    markPickedUp: useMutation({
      mutationFn: captainApi.markPickedUp,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    markDelivered: useMutation({
      mutationFn: ({
        orderId,
        payload,
      }: {
        orderId: string;
        payload: { paymentCollected: boolean; collectedAmount?: number; deliveryProofImage?: string };
      }) => captainApi.markDelivered(orderId, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
  };
};
