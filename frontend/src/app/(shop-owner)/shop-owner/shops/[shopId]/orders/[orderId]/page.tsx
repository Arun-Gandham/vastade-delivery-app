"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { orderApi } from "@/features/orders/order.api";
import { useOrderMutations } from "@/features/orders/order.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function ShopOrderDetailPage() {
  const params = useParams<{ shopId: string; orderId: string }>();
  const orderQuery = useQuery({
    queryKey: queryKeys.order(params.orderId),
    queryFn: () => orderApi.shopOrderDetails(params.shopId, params.orderId),
  });
  const captainsQuery = useQuery({
    queryKey: queryKeys.availableCaptains,
    queryFn: orderApi.availableCaptains,
  });
  const mutations = useOrderMutations();

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
              <Button onClick={() => mutations.confirmShopOrder.mutate(orderQuery.data!.id)}>Confirm</Button>
              <Button variant="outline" onClick={() => mutations.markPacking.mutate(orderQuery.data!.id)}>
                Mark Packing
              </Button>
              <Button variant="outline" onClick={() => mutations.readyForPickup.mutate(orderQuery.data!.id)}>
                Ready for Pickup
              </Button>
              <Button
                variant="outline"
                disabled={!captainsQuery.data?.[0]}
                onClick={() =>
                  captainsQuery.data?.[0] &&
                  mutations.assignCaptainByShop.mutate({
                    orderId: orderQuery.data!.id,
                    captainId: captainsQuery.data[0].id,
                  })
                }
              >
                Assign First Available Captain
              </Button>
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
