"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { orderApi } from "@/features/orders/order.api";
import { useOrderMutations } from "@/features/orders/order.hooks";
import { authStorage } from "@/lib/storage/auth-storage";
import { getRealtimeSocket } from "@/lib/realtime/socket-client";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderQuery = useQuery({
    queryKey: queryKeys.order(params.orderId),
    queryFn: () => orderApi.adminOrderDetails(params.orderId),
  });
  const mutations = useOrderMutations();

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) {
      return;
    }

    const socket = getRealtimeSocket(token);
    socket.emit("subscribe:order", params.orderId);
    const refresh = () => void orderQuery.refetch();

    socket.on("order:assigned", refresh);
    socket.on("order:ready-for-pickup", refresh);
    socket.on("order:picked-up", refresh);
    socket.on("order:delivered", refresh);

    return () => {
      socket.emit("unsubscribe:order", params.orderId);
      socket.off("order:assigned", refresh);
      socket.off("order:ready-for-pickup", refresh);
      socket.off("order:picked-up", refresh);
      socket.off("order:delivered", refresh);
    };
  }, [orderQuery, params.orderId]);

  const renderNextAction = () => {
    const order = orderQuery.data;
    if (!order) {
      return null;
    }

    if (order.status === "PENDING") {
      return <Button onClick={() => mutations.adminAcceptOrder.mutate(order.id)}>Accept Order</Button>;
    }

    if (order.status === "ACCEPTED") {
      return <p className="text-sm text-[var(--color-text-muted)]">Waiting for a captain to accept this order.</p>;
    }

    if (order.status === "CAPTAIN_ASSIGNED") {
      return (
        <Button variant="outline" onClick={() => mutations.adminReadyForPickup.mutate(order.id)}>
          Ready for Pickup
        </Button>
      );
    }

    return <p className="text-sm text-[var(--color-text-muted)]">No direct admin action is available for this status.</p>;
  };

  return (
    <DataState
      isLoading={orderQuery.isLoading}
      error={getErrorMessage(orderQuery.error, "")}
      isEmpty={!orderQuery.data}
      emptyTitle="Order unavailable"
      emptyDescription="This admin order detail could not be loaded."
    >
      {orderQuery.data ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">{orderQuery.data.orderNumber}</h1>
              <StatusBadge value={orderQuery.data.status} />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Customer: {orderQuery.data.customer?.name || orderQuery.data.customerId}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Shop: {orderQuery.data.shop?.name || orderQuery.data.shopId}</p>
            {orderQuery.data.captain ? (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm">
                <p className="font-medium text-[#111827]">Assigned Captain</p>
                <p className="text-[var(--color-text-muted)]">{orderQuery.data.captain.name}</p>
                <p className="text-[var(--color-text-muted)]">{orderQuery.data.captain.mobile}</p>
              </div>
            ) : null}
          </Card>
          <Card className="space-y-3">{renderNextAction()}</Card>
        </div>
      ) : null}
    </DataState>
  );
}
