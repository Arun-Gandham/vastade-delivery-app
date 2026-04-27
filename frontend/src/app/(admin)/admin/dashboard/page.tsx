"use client";

import { DataState } from "@/components/shared/data-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderCard } from "@/components/customer/order-card";
import { useAdminDashboardQuery } from "@/features/dashboard/dashboard.hooks";
import { orderApi } from "@/features/orders/order.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatCurrency } from "@/lib/utils/format";

export default function AdminDashboardPage() {
  const summaryQuery = useAdminDashboardQuery();
  const ordersQuery = useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: orderApi.adminOrders,
  });

  return (
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
  );
}
