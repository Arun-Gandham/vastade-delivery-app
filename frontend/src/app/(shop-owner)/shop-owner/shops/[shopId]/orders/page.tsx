"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OrderCard } from "@/components/customer/order-card";
import { DataState } from "@/components/shared/data-state";
import { useShopOrdersQuery } from "@/features/orders/order.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function ShopOrdersPage() {
  const params = useParams<{ shopId: string }>();
  const ordersQuery = useShopOrdersQuery(params.shopId);

  return (
    <DashboardShell
      title="Shop Orders"
      navItems={[
        { href: "/shop-owner/shops", label: "Shops" },
        { href: `/shop-owner/shops/${params.shopId}/dashboard`, label: "Dashboard" },
        { href: `/shop-owner/shops/${params.shopId}/orders`, label: "Orders" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <DataState
          isLoading={ordersQuery.isLoading}
          error={getErrorMessage(ordersQuery.error, "")}
          isEmpty={!ordersQuery.data?.length}
          emptyTitle="No orders yet"
          emptyDescription="Incoming shop orders will appear here."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {ordersQuery.data?.map((order) => (
              <OrderCard key={order.id} order={order} basePath={`/shop-owner/shops/${params.shopId}/orders`} />
            ))}
          </div>
        </DataState>
      </div>
    </DashboardShell>
  );
}
