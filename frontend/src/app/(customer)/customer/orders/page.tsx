"use client";

import { useState } from "react";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { OrderCard } from "@/components/customer/order-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Select } from "@/components/ui/select";
import { useOrdersQuery } from "@/features/orders/order.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CustomerOrdersPage() {
  const [status, setStatus] = useState("");
  const ordersQuery = useOrdersQuery(status ? { status } : undefined);

  return (
    <CustomerAppShell>
      <PageContainer title="My Orders" description="Track current and completed customer orders.">
        <div className="max-w-sm">
          <Select
            label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { label: "All statuses", value: "" },
              { label: "Pending", value: "PENDING" },
              { label: "Accepted", value: "ACCEPTED" },
              { label: "Picked Up", value: "PICKED_UP" },
              { label: "Delivered", value: "DELIVERED" },
              { label: "Cancelled", value: "CANCELLED" },
            ]}
          />
        </div>
        <DataState
          isLoading={ordersQuery.isLoading}
          error={getErrorMessage(ordersQuery.error, "")}
          isEmpty={!ordersQuery.data?.length}
          emptyTitle="No orders found"
          emptyDescription="Orders will appear here after checkout."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ordersQuery.data?.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
