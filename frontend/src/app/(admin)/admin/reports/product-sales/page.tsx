"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { useReportQuery } from "@/features/dashboard/dashboard.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminProductSalesReportPage() {
  const reportQuery = useReportQuery("product-sales");

  return (
    <DashboardShell title="Product Sales Report" navItems={[{ href: "/admin/dashboard", label: "Dashboard" }, { href: "/admin/reports/product-sales", label: "Product Sales" }]}>
      <DataState
        isLoading={reportQuery.isLoading}
        error={getErrorMessage(reportQuery.error, "")}
        isEmpty={!reportQuery.data?.length}
        emptyTitle="No product sales rows"
        emptyDescription="Product sales rows will appear after orders are delivered."
      >
        <DataTable
          columns={Object.keys(reportQuery.data?.[0] || {})}
          rows={(reportQuery.data || []).map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value ?? "-")])))}
        />
      </DataState>
    </DashboardShell>
  );
}
