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
    queryFn: captainApi.tasks,
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
      mutationFn: captainApi.acceptTask,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    rejectOrder: useMutation({
      mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
        captainApi.rejectTask(orderId, reason),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    markReachedPickup: useMutation({
      mutationFn: captainApi.markReachedPickup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    markPickedUp: useMutation({
      mutationFn: captainApi.markPickedUp,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    markReachedDrop: useMutation({
      mutationFn: captainApi.markReachedDrop,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    markDelivered: useMutation({
      mutationFn: captainApi.markDelivered,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
    markFailed: useMutation({
      mutationFn: captainApi.markFailed,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainOrders }),
    }),
  };
};
