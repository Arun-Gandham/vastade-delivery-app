"use client";

import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { OrderCard } from "@/components/customer/order-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { useCaptainOrdersDataQuery } from "@/features/captain/captain.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CaptainOrdersPage() {
  const ordersQuery = useCaptainOrdersDataQuery();

  return (
    <CaptainAppShell>
      <PageContainer title="Assigned Orders" description="Pickup, deliver, and collect COD for your active tasks.">
        <DataState
          isLoading={ordersQuery.isLoading}
          error={getErrorMessage(ordersQuery.error, "")}
          isEmpty={!ordersQuery.data?.length}
          emptyTitle="No captain orders"
          emptyDescription="Orders assigned by shops or admins will appear here."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {ordersQuery.data?.map((order) => <OrderCard key={order.id} order={order} basePath="/captain/orders" />)}
          </div>
        </DataState>
      </PageContainer>
    </CaptainAppShell>
  );
}
