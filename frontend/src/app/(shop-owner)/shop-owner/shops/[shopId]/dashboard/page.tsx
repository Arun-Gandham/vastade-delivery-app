"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OrderCard } from "@/components/customer/order-card";
import { DataState } from "@/components/shared/data-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/features/dashboard/dashboard.api";
import { useShopSummaryQuery } from "@/features/dashboard/dashboard.hooks";
import { useShopOrdersQuery } from "@/features/orders/order.hooks";
import { useShopMutations } from "@/features/shops/shop.hooks";
import { useShopQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatCurrency } from "@/lib/utils/format";

export default function ShopDashboardPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const summaryQuery = useShopSummaryQuery(shopId);
  const ordersQuery = useShopOrdersQuery(shopId);
  const shopQuery = useShopQuery(shopId);
  const shopMutations = useShopMutations();

  return (
    <DashboardShell
      title="Shop Dashboard"
      navItems={[
        { href: "/shop-owner/shops", label: "Shops" },
        { href: `/shop-owner/shops/${shopId}/dashboard`, label: "Dashboard" },
        { href: `/shop-owner/shops/${shopId}/inventory`, label: "Inventory" },
        { href: `/shop-owner/shops/${shopId}/orders`, label: "Orders" },
        { href: `/shop-owner/shops/${shopId}/reports`, label: "Reports" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{shopQuery.data?.name || "Shop"}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Track performance and live order operations.</p>
          </div>
          {shopQuery.data ? (
            <Button
              variant={shopQuery.data.isOpen ? "success" : "outline"}
              loading={shopMutations.updateOpenStatus.isPending}
              onClick={() =>
                shopMutations.updateOpenStatus.mutate({
                  shopId,
                  isOpen: !shopQuery.data!.isOpen,
                })
              }
            >
              {shopQuery.data.isOpen ? "Shop Open" : "Shop Closed"}
            </Button>
          ) : null}
        </div>
        <DataState
          isLoading={summaryQuery.isLoading}
          error={getErrorMessage(summaryQuery.error, "")}
          isEmpty={!summaryQuery.data}
          emptyTitle="Summary unavailable"
          emptyDescription="This shop summary could not be loaded."
        >
          {summaryQuery.data ? (
            <>
              <div className="dashboard-grid">
                <StatCard label="Today Orders" value={summaryQuery.data.todayOrders} />
                <StatCard label="Today Revenue" value={formatCurrency(summaryQuery.data.todayRevenue)} />
                <StatCard label="Pending Orders" value={summaryQuery.data.pendingOrders} />
                <StatCard label="Low Stock" value={summaryQuery.data.lowStockProducts || 0} />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {ordersQuery.data?.slice(0, 4).map((order) => (
                    <OrderCard key={order.id} order={order} basePath={`/shop-owner/shops/${shopId}/orders`} />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </DataState>
      </div>
    </DashboardShell>
  );
}
