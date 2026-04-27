"use client";

import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { useReportQuery } from "@/features/dashboard/dashboard.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminProductSalesReportPage() {
  const reportQuery = useReportQuery("product-sales");

  return (
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
  );
}
