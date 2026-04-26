"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { orderApi } from "@/features/orders/order.api";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminCustomersPage() {
  const ordersQuery = useQuery({ queryKey: queryKeys.adminOrders, queryFn: orderApi.adminOrders });
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; mobile: string }>();
    (ordersQuery.data || []).forEach((order) => {
      if (order.customer) {
        map.set(order.customer.id, { name: order.customer.name, mobile: order.customer.mobile });
      }
    });
    return Array.from(map.entries()).map(([id, value]) => ({ id, ...value }));
  }, [ordersQuery.data]);

  return (
    <DashboardShell title="Customers" navItems={[{ href: "/admin/dashboard", label: "Dashboard" }, { href: "/admin/customers", label: "Customers" }]}>
      <DataState
        isLoading={ordersQuery.isLoading}
        error={getErrorMessage(ordersQuery.error, "")}
        isEmpty={!customers.length}
        emptyTitle="No customers derived yet"
        emptyDescription="Customer rows are derived from real admin order data in the current MVP backend."
      >
        <DataTable
          columns={["Customer ID", "Name", "Mobile"]}
          rows={customers.map((customer) => ({
            "Customer ID": customer.id,
            Name: customer.name,
            Mobile: customer.mobile,
          }))}
        />
      </DataState>
    </DashboardShell>
  );
}
