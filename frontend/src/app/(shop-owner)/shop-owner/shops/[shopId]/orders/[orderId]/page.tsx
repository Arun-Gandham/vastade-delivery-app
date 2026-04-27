"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { orderApi } from "@/features/orders/order.api";
import { useOrderMutations } from "@/features/orders/order.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { authStorage } from "@/lib/storage/auth-storage";
import { getRealtimeSocket } from "@/lib/realtime/socket-client";

export default function ShopOrderDetailPage() {
  const params = useParams<{ shopId: string; orderId: string }>();
  const orderQuery = useQuery({
    queryKey: queryKeys.order(params.orderId),
    queryFn: () => orderApi.shopOrderDetails(params.shopId, params.orderId),
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

  return (
    <DashboardShell
      title="Order Detail"
      navItems={[
        { href: "/shop-owner/shops", label: "Shops" },
        { href: `/shop-owner/shops/${params.shopId}/orders`, label: "Orders" },
      ]}
    >
      <DataState
        isLoading={orderQuery.isLoading}
        error={getErrorMessage(orderQuery.error, "")}
        isEmpty={!orderQuery.data}
        emptyTitle="Order unavailable"
        emptyDescription="This order could not be loaded for the current shop."
      >
        {orderQuery.data ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">{orderQuery.data.orderNumber}</h1>
                <StatusBadge value={orderQuery.data.status} />
              </div>
              {orderQuery.data.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-sm">
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <PriceText value={item.totalPrice} />
                </div>
              ))}
            </Card>
            <Card className="space-y-3">
              {orderQuery.data.status === "PENDING" ? (
                <Button onClick={() => mutations.confirmShopOrder.mutate(orderQuery.data!.id)}>Accept Order</Button>
              ) : null}
              {orderQuery.data.status === "ACCEPTED" ? (
                <p className="text-sm text-[var(--color-text-muted)]">Waiting for a captain to accept this order.</p>
              ) : null}
              {orderQuery.data.status === "CAPTAIN_ASSIGNED" ? (
                <Button variant="outline" onClick={() => mutations.readyForPickup.mutate(orderQuery.data!.id)}>
                  Ready for Pickup
                </Button>
              ) : null}
              {orderQuery.data.captain ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm">
                  <p className="font-medium text-[#111827]">Assigned Captain</p>
                  <p className="text-[var(--color-text-muted)]">{orderQuery.data.captain.name}</p>
                  <p className="text-[var(--color-text-muted)]">{orderQuery.data.captain.mobile}</p>
                </div>
              ) : null}
              <Button
                variant="danger"
                onClick={() =>
                  mutations.cancelShopOrder.mutate({
                    orderId: orderQuery.data!.id,
                    reason: "Item unavailable",
                  })
                }
              >
                Cancel Order
              </Button>
            </Card>
          </div>
        ) : null}
      </DataState>
    </DashboardShell>
  );
}
