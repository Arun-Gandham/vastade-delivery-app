"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useCaptainActiveOrdersQuery,
  useCaptainMutations,
  useCaptainOrdersDataQuery
} from "@/features/captain/captain.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatDateTime } from "@/lib/utils/format";

export default function CaptainOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const availableOrdersQuery = useCaptainOrdersDataQuery();
  const activeOrdersQuery = useCaptainActiveOrdersQuery();
  const mutations = useCaptainMutations();
  const [actionError, setActionError] = useState<string | null>(null);

  const task = useMemo(
    () =>
      [...(availableOrdersQuery.data ?? []), ...(activeOrdersQuery.data ?? [])].find(
        (item) => item.orderId === params.orderId
      ),
    [activeOrdersQuery.data, availableOrdersQuery.data, params.orderId]
  );

  return (
    <CaptainAppShell>
      <PageContainer title="Delivery Order" description="Accept the order, wait for pickup readiness, then complete delivery.">
        <DataState
          isLoading={availableOrdersQuery.isLoading || activeOrdersQuery.isLoading}
          error={getErrorMessage(availableOrdersQuery.error || activeOrdersQuery.error, "")}
          isEmpty={!task}
          emptyTitle="Order unavailable"
          emptyDescription="This order is no longer available in your captain workspace."
        >
          {task ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{task.orderNumber}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{formatDateTime(task.createdAt)}</p>
                  </div>
                  <StatusBadge value={task.status} />
                </div>
                <div className="space-y-3 border-t border-[var(--color-border)] pt-3 text-sm">
                  <div>
                    <p className="font-medium text-[#111827]">Pickup</p>
                    <p className="text-[var(--color-text-muted)]">{task.pickupAddress}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{task.shop?.name || "Shop"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">Drop</p>
                    <p className="text-[var(--color-text-muted)]">{task.dropAddress}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{task.customer?.name || "Customer"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-muted)]">Order amount</span>
                    <PriceText value={task.amount} />
                  </div>
                </div>
              </Card>
              <Card className="space-y-3">
                {task.status === "ACCEPTED" ? (
                  <Button
                    loading={mutations.acceptOrder.isPending}
                    onClick={async () => {
                      try {
                        setActionError(null);
                        await mutations.acceptOrder.mutateAsync(task.orderId);
                      } catch (error) {
                        const message = getErrorMessage(error, "Failed to accept order");
                        setActionError(message);
                      }
                    }}
                  >
                    Accept Order
                  </Button>
                ) : null}
                {task.status === "CAPTAIN_ASSIGNED" ? (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Waiting for the shop/admin to mark this order ready for pickup.
                  </p>
                ) : null}
                {task.status === "READY_FOR_PICKUP" ? (
                  <Button
                    loading={mutations.markPickedUp.isPending}
                    variant="outline"
                    onClick={async () => {
                      try {
                        setActionError(null);
                        await mutations.markPickedUp.mutateAsync(task.orderId);
                      } catch (error) {
                        setActionError(getErrorMessage(error, "Failed to mark order picked up"));
                      }
                    }}
                  >
                    Mark Picked Up
                  </Button>
                ) : null}
                {task.status === "PICKED_UP" ? (
                  <Button
                    loading={mutations.markDelivered.isPending}
                    variant="success"
                    onClick={async () => {
                      try {
                        setActionError(null);
                        await mutations.markDelivered.mutateAsync(task.orderId);
                      } catch (error) {
                        setActionError(getErrorMessage(error, "Failed to mark order delivered"));
                      }
                    }}
                  >
                    Mark Delivered
                  </Button>
                ) : null}
                {actionError ? <p className="text-xs text-[var(--color-danger)]">{actionError}</p> : null}
              </Card>
            </div>
          ) : null}
        </DataState>
      </PageContainer>
    </CaptainAppShell>
  );
}
