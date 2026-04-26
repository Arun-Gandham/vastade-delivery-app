"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCaptainMutations, useCaptainOrdersDataQuery } from "@/features/captain/captain.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CaptainOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const ordersQuery = useCaptainOrdersDataQuery();
  const order = ordersQuery.data?.find((item) => item.id === params.orderId);
  const mutations = useCaptainMutations();
  const [deliveryProofImage, setDeliveryProofImage] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  return (
    <CaptainAppShell>
      <PageContainer title="Delivery Task" description="Complete pickup and final delivery actions from one place.">
        <DataState
          isLoading={ordersQuery.isLoading}
          error={getErrorMessage(ordersQuery.error, "")}
          isEmpty={!order}
          emptyTitle="Order unavailable"
          emptyDescription="This captain order could not be found in your assignment list."
        >
          {order ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{order.orderNumber}</h2>
                  <StatusBadge value={order.status} />
                </div>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                    <span className="text-sm">
                      {item.productName} x {item.quantity}
                    </span>
                    <PriceText value={item.totalPrice} />
                  </div>
                ))}
              </Card>
              <Card className="space-y-3">
                <Button loading={mutations.acceptOrder.isPending} onClick={() => mutations.acceptOrder.mutate(order.id)}>
                  Accept
                </Button>
                <Button
                  loading={mutations.markPickedUp.isPending}
                  variant="outline"
                  onClick={() => mutations.markPickedUp.mutate(order.id)}
                >
                  Mark Picked Up
                </Button>
                <ImageUploadField
                  folder="delivery-proofs"
                  helperText="Optional proof image uploads directly to S3 before the delivery API is submitted. Only the object key is stored."
                  label="Delivery Proof"
                  onChange={setDeliveryProofImage}
                  value={deliveryProofImage}
                />
                {actionError ? <p className="text-xs text-[var(--color-danger)]">{actionError}</p> : null}
                <Button
                  loading={mutations.markDelivered.isPending}
                  variant="success"
                  onClick={async () => {
                    try {
                      setActionError(null);
                      await mutations.markDelivered.mutateAsync({
                        orderId: order.id,
                        payload: {
                          paymentCollected: order.paymentMode === "COD",
                          collectedAmount: Number(order.totalAmount),
                          deliveryProofImage: deliveryProofImage || undefined,
                        },
                      });
                      setDeliveryProofImage("");
                    } catch (error) {
                      setActionError(getErrorMessage(error, "Failed to mark order delivered"));
                    }
                  }}
                >
                  Mark Delivered
                </Button>
              </Card>
            </div>
          ) : null}
        </DataState>
      </PageContainer>
    </CaptainAppShell>
  );
}
