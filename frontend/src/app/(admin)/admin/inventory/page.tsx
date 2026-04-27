"use client";

import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { useReportQuery } from "@/features/dashboard/dashboard.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminInventoryPage() {
  const lowStockQuery = useReportQuery("low-stock");

  return (
    <DataState
      isLoading={lowStockQuery.isLoading}
      error={getErrorMessage(lowStockQuery.error, "")}
      isEmpty={!lowStockQuery.data?.length}
      emptyTitle="No low-stock records"
      emptyDescription="Inventory alerts will appear once shops update stock."
    >
      <DataTable
        columns={Object.keys(lowStockQuery.data?.[0] || {})}
        rows={(lowStockQuery.data || []).map((row) =>
          Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value ?? "-")]))
        )}
      />
    </DataState>
  );
}
