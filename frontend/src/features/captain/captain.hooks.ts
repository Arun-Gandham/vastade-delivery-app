"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { captainApi } from "@/features/captain/captain.api";
import type { CaptainProfile } from "@/types/domain";

export const useCaptainProfileQuery = () =>
  useQuery({
    queryKey: queryKeys.captainProfile,
    queryFn: captainApi.getMe,
  });

export const useCaptainOrdersDataQuery = () =>
  useQuery({
    queryKey: queryKeys.captainAvailableOrders,
    queryFn: captainApi.availableOrders,
  });

export const useCaptainActiveOrdersQuery = () =>
  useQuery({
    queryKey: queryKeys.captainActiveOrders,
    queryFn: captainApi.activeOrders,
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
      onSuccess: (profile) =>
        queryClient.setQueryData<CaptainProfile>(queryKeys.captainProfile, (current) =>
          current
            ? {
                ...current,
                currentLatitude: profile.currentLatitude,
                currentLongitude: profile.currentLongitude,
              }
            : profile
        ),
    }),
    acceptOrder: useMutation({
      mutationFn: captainApi.acceptTask,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.captainAvailableOrders });
        queryClient.invalidateQueries({ queryKey: queryKeys.captainActiveOrders });
      },
    }),
    rejectOrder: useMutation({
      mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
        captainApi.rejectTask(orderId, reason),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainAvailableOrders }),
    }),
    markReachedPickup: useMutation({
      mutationFn: captainApi.markReachedPickup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainActiveOrders }),
    }),
    markPickedUp: useMutation({
      mutationFn: captainApi.markPickedUp,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainActiveOrders }),
    }),
    markReachedDrop: useMutation({
      mutationFn: captainApi.markReachedDrop,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainActiveOrders }),
    }),
    markDelivered: useMutation({
      mutationFn: captainApi.markDelivered,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainActiveOrders }),
    }),
    markFailed: useMutation({
      mutationFn: captainApi.markFailed,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.captainActiveOrders }),
    }),
  };
};
