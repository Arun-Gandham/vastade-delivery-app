"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCaptainMutations, useCaptainOrdersDataQuery } from "@/features/captain/captain.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatDateTime, formatOrderStatus } from "@/lib/utils/format";

export default function CaptainOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const tasksQuery = useCaptainOrdersDataQuery();
  const task = tasksQuery.data?.find((item) => item.id === params.orderId);
  const mutations = useCaptainMutations();
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  return (
    <CaptainAppShell>
      <PageContainer title="Delivery Task" description="Use captain-specific task actions instead of the old shared order flow.">
        <DataState
          isLoading={tasksQuery.isLoading}
          error={getErrorMessage(tasksQuery.error, "")}
          isEmpty={!task}
          emptyTitle="Task unavailable"
          emptyDescription="This captain task could not be found in your task list."
        >
          {task ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{formatOrderStatus(task.taskType)}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{formatDateTime(task.createdAt)}</p>
                  </div>
                  <StatusBadge value={task.status} />
                </div>
                <div className="space-y-3 border-t border-[var(--color-border)] pt-3 text-sm">
                  <div>
                    <p className="font-medium text-[#111827]">Pickup</p>
                    <p className="text-[var(--color-text-muted)]">{task.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">Drop</p>
                    <p className="text-[var(--color-text-muted)]">{task.dropAddress}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-muted)]">Estimated earning</span>
                    <PriceText value={task.deliveryFee} />
                  </div>
                </div>
              </Card>
              <Card className="space-y-3">
                {task.status === "OFFERED_TO_CAPTAINS" ? (
                  <>
                    <Button loading={mutations.acceptOrder.isPending} onClick={() => mutations.acceptOrder.mutate(task.id)}>
                      Accept Task
                    </Button>
                    <div className="space-y-2">
                      <input
                        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
                        onChange={(event) => setRejectReason(event.target.value)}
                        placeholder="Reason to reject"
                        value={rejectReason}
                      />
                      <Button
                        loading={mutations.rejectOrder.isPending}
                        variant="outline"
                        onClick={() => mutations.rejectOrder.mutate({ orderId: task.id, reason: rejectReason || "Not available" })}
                      >
                        Reject Task
                      </Button>
                    </div>
                  </>
                ) : null}
                {task.status === "ACCEPTED" ? (
                  <Button
                    loading={mutations.markReachedPickup.isPending}
                    variant="outline"
                    onClick={() => mutations.markReachedPickup.mutate(task.id)}
                  >
                    Reached Pickup
                  </Button>
                ) : null}
                {task.status === "CAPTAIN_REACHED_PICKUP" ? (
                  <Button
                    loading={mutations.markPickedUp.isPending}
                    variant="outline"
                    onClick={() => mutations.markPickedUp.mutate(task.id)}
                  >
                    Picked Up
                  </Button>
                ) : null}
                {task.status === "PICKED_UP" ? (
                  <Button
                    loading={mutations.markReachedDrop.isPending}
                    variant="outline"
                    onClick={() => mutations.markReachedDrop.mutate(task.id)}
                  >
                    Reached Drop
                  </Button>
                ) : null}
                {actionError ? <p className="text-xs text-[var(--color-danger)]">{actionError}</p> : null}
                {task.status === "CAPTAIN_REACHED_DROP" ? (
                  <Button
                    loading={mutations.markDelivered.isPending}
                    variant="success"
                    onClick={async () => {
                      try {
                        setActionError(null);
                        await mutations.markDelivered.mutateAsync(task.id);
                      } catch (error) {
                        setActionError(getErrorMessage(error, "Failed to mark task delivered"));
                      }
                    }}
                  >
                    Mark Delivered
                  </Button>
                ) : null}
                {["ACCEPTED", "CAPTAIN_REACHED_PICKUP", "PICKED_UP", "CAPTAIN_REACHED_DROP"].includes(task.status) ? (
                  <Button
                    loading={mutations.markFailed.isPending}
                    variant="danger"
                    onClick={() => mutations.markFailed.mutate(task.id)}
                  >
                    Mark Failed
                  </Button>
                ) : null}
              </Card>
            </div>
          ) : null}
        </DataState>
      </PageContainer>
    </CaptainAppShell>
  );
}
