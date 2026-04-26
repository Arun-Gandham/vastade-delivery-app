"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { orderApi } from "@/features/orders/order.api";
import { useOrderMutations } from "@/features/orders/order.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderQuery = useQuery({
    queryKey: queryKeys.order(params.orderId),
    queryFn: () => orderApi.adminOrderDetails(params.orderId),
  });
  const captainsQuery = useQuery({
    queryKey: queryKeys.availableCaptains,
    queryFn: orderApi.availableCaptains,
  });
  const mutations = useOrderMutations();

  return (
    <DashboardShell title="Admin Order Detail" navItems={[{ href: "/admin/orders", label: "Orders" }]}>
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
            </Card>
            <Card className="space-y-3">
              <Button onClick={() => mutations.adminUpdateStatus.mutate({ orderId: orderQuery.data!.id, status: "CONFIRMED" })}>
                Confirm
              </Button>
              <Button variant="outline" onClick={() => mutations.adminUpdateStatus.mutate({ orderId: orderQuery.data!.id, status: "PACKING" })}>
                Mark Packing
              </Button>
              <Button variant="outline" onClick={() => mutations.adminUpdateStatus.mutate({ orderId: orderQuery.data!.id, status: "READY_FOR_PICKUP" })}>
                Ready for Pickup
              </Button>
              <Button
                variant="outline"
                disabled={!captainsQuery.data?.[0]}
                onClick={() =>
                  captainsQuery.data?.[0] &&
                  mutations.adminAssignCaptain.mutate({
                    orderId: orderQuery.data!.id,
                    captainId: captainsQuery.data[0].id,
                  })
                }
              >
                Assign First Available Captain
              </Button>
            </Card>
          </div>
        ) : null}
      </DataState>
    </DashboardShell>
  );
}
