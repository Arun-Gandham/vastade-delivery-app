"use client";

import { useParams } from "next/navigation";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { useOrderMutations, useOrderQuery } from "@/features/orders/order.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatDateTime } from "@/lib/utils/format";

const cancellableStatuses = ["PLACED", "CONFIRMED", "PACKING"];

export default function CustomerOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderQuery = useOrderQuery(params.orderId);
  const orderMutations = useOrderMutations();

  return (
    <CustomerAppShell>
      <PageContainer title="Order Details" description="Track status, items, and delivery information.">
        <DataState
          isLoading={orderQuery.isLoading}
          error={getErrorMessage(orderQuery.error, "")}
          isEmpty={!orderQuery.data}
          emptyTitle="Order not found"
          emptyDescription="This order could not be loaded."
        >
          {orderQuery.data ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <Card className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{orderQuery.data.orderNumber}</h2>
                    <StatusBadge value={orderQuery.data.status} />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">Placed: {formatDateTime(orderQuery.data.placedAt)}</p>
                  <div className="space-y-3">
                    {orderQuery.data.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-sm">
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <PriceText value={item.totalPrice} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Total amount</span>
                  <PriceText value={orderQuery.data.totalAmount} className="text-lg font-bold" />
                </div>
                {cancellableStatuses.includes(orderQuery.data.status) ? (
                  <Button
                    variant="danger"
                    loading={orderMutations.cancelCustomerOrder.isPending}
                    onClick={() =>
                      orderMutations.cancelCustomerOrder.mutate({
                        orderId: orderQuery.data!.id,
                        reason: "Ordered by mistake",
                      })
                    }
                  >
                    Cancel Order
                  </Button>
                ) : null}
              </Card>
            </div>
          ) : null}
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
