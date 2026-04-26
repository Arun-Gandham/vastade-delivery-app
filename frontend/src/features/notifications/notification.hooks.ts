"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { notificationApi } from "@/features/notifications/notification.api";

export const useNotificationsQuery = () =>
  useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationApi.list,
  });

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();
  return {
    markRead: useMutation({
      mutationFn: notificationApi.markRead,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
    }),
  };
};
