"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { useAuth } from "@/providers/auth-provider";
import { authStorage } from "@/lib/storage/auth-storage";
import { getRealtimeSocket } from "@/lib/realtime/socket-client";
import type { CaptainOrder } from "@/types/domain";

export const useCaptainRealtime = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user?.role !== "CAPTAIN") {
      setIsConnected(false);
      return;
    }

    const token = authStorage.getAccessToken();
    if (!token) {
      setIsConnected(false);
      return;
    }

    const socket = getRealtimeSocket(token);

    const syncAvailable = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.captainAvailableOrders });
    };

    const syncActive = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.captainActiveOrders });
    };

    const syncProfile = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.captainProfile });
    };

    const handleAvailable = () => {
      syncAvailable();
    };

    const handleRemove = (payload: { orderId?: string }) => {
      if (payload.orderId) {
        queryClient.setQueryData<CaptainOrder[]>(queryKeys.captainAvailableOrders, (current) =>
          (current ?? []).filter((order) => order.orderId !== payload.orderId)
        );
      }
      syncAvailable();
    };

    const handleAssigned = () => {
      syncAvailable();
      syncActive();
      syncProfile();
    };

    const handleStatusUpdate = () => {
      syncActive();
    };

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    setIsConnected(socket.connected);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("order:available-for-captains", handleAvailable);
    socket.on("order:remove-from-available", handleRemove);
    socket.on("order:assigned", handleAssigned);
    socket.on("order:ready-for-pickup", handleStatusUpdate);
    socket.on("order:picked-up", handleStatusUpdate);
    socket.on("order:delivered", handleStatusUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("order:available-for-captains", handleAvailable);
      socket.off("order:remove-from-available", handleRemove);
      socket.off("order:assigned", handleAssigned);
      socket.off("order:ready-for-pickup", handleStatusUpdate);
      socket.off("order:picked-up", handleStatusUpdate);
      socket.off("order:delivered", handleStatusUpdate);
    };
  }, [queryClient, user?.role]);

  return { isConnected };
};
