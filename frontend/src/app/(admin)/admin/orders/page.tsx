"use client";

import { OrderCard } from "@/components/customer/order-card";
import { DataState } from "@/components/shared/data-state";
import { orderApi } from "@/features/orders/order.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminOrdersPage() {
  const ordersQuery = useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: orderApi.adminOrders,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <DataState
        isLoading={ordersQuery.isLoading}
        error={getErrorMessage(ordersQuery.error, "")}
        isEmpty={!ordersQuery.data?.length}
        emptyTitle="No orders"
        emptyDescription="Orders will appear here once customers start placing them."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {ordersQuery.data?.map((order) => <OrderCard key={order.id} order={order} basePath="/admin/orders" />)}
        </div>
      </DataState>
    </div>
  );
}
