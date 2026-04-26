"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderCard } from "@/components/customer/order-card";
import { useAdminDashboardQuery } from "@/features/dashboard/dashboard.hooks";
import { orderApi } from "@/features/orders/order.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatCurrency } from "@/lib/utils/format";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/shops", label: "Shops" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/captains", label: "Captains" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminDashboardPage() {
  const summaryQuery = useAdminDashboardQuery();
  const ordersQuery = useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: orderApi.adminOrders,
  });

  return (
    <DashboardShell title="Admin Panel" navItems={navItems}>
      <div className="space-y-6">
        <DataState
          isLoading={summaryQuery.isLoading}
          error={getErrorMessage(summaryQuery.error, "")}
          isEmpty={!summaryQuery.data}
          emptyTitle="Dashboard unavailable"
          emptyDescription="Admin summary data is not available right now."
        >
          {summaryQuery.data ? (
            <>
              <div className="dashboard-grid">
                <StatCard label="Total Orders" value={summaryQuery.data.totalOrders || 0} />
                <StatCard label="Today Orders" value={summaryQuery.data.todayOrders} />
                <StatCard label="Today Revenue" value={formatCurrency(summaryQuery.data.todayRevenue)} />
                <StatCard label="Active Shops" value={summaryQuery.data.activeShops || 0} />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {ordersQuery.data?.slice(0, 4).map((order) => (
                    <OrderCard key={order.id} order={order} basePath="/admin/orders" />
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
