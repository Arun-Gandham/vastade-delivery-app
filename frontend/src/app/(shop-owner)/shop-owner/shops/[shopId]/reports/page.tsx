"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { useReportQuery } from "@/features/dashboard/dashboard.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function ShopReportsPage() {
  const params = useParams<{ shopId: string }>();
  const salesQuery = useReportQuery("sales", params.shopId);
  const lowStockQuery = useReportQuery("low-stock", params.shopId);

  return (
    <DashboardShell
      title="Reports"
      navItems={[
        { href: "/shop-owner/shops", label: "Shops" },
        { href: `/shop-owner/shops/${params.shopId}/reports`, label: "Reports" },
      ]}
    >
      <div className="space-y-6">
        <DataState
          isLoading={salesQuery.isLoading}
          error={getErrorMessage(salesQuery.error, "")}
          isEmpty={!salesQuery.data?.length}
          emptyTitle="No sales report data"
          emptyDescription="Shop sales rows will appear when orders start closing."
        >
          <DataTable
            columns={Object.keys(salesQuery.data?.[0] || {})}
            rows={(salesQuery.data || []).map((row) =>
              Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value ?? "-")]))
            )}
          />
        </DataState>
        <DataState
          isLoading={lowStockQuery.isLoading}
          error={getErrorMessage(lowStockQuery.error, "")}
          isEmpty={!lowStockQuery.data?.length}
          emptyTitle="No low-stock rows"
          emptyDescription="Low-stock alerts will appear once inventory is configured."
        >
          <DataTable
            columns={Object.keys(lowStockQuery.data?.[0] || {})}
            rows={(lowStockQuery.data || []).map((row) =>
              Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value ?? "-")]))
            )}
          />
        </DataState>
      </div>
    </DashboardShell>
  );
}
