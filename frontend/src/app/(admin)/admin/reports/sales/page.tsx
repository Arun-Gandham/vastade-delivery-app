"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { useReportQuery } from "@/features/dashboard/dashboard.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminSalesReportPage() {
  const reportQuery = useReportQuery("sales");

  return (
    <DashboardShell title="Sales Report" navItems={[{ href: "/admin/dashboard", label: "Dashboard" }, { href: "/admin/reports/sales", label: "Sales Report" }]}>
      <DataState
        isLoading={reportQuery.isLoading}
        error={getErrorMessage(reportQuery.error, "")}
        isEmpty={!reportQuery.data?.length}
        emptyTitle="No sales report rows"
        emptyDescription="Sales report data will appear here once orders are processed."
      >
        <DataTable
          columns={Object.keys(reportQuery.data?.[0] || {})}
          rows={(reportQuery.data || []).map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value ?? "-")])))}
        />
      </DataState>
    </DashboardShell>
  );
}
