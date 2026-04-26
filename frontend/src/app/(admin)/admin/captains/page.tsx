"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { orderApi } from "@/features/orders/order.api";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminCaptainsPage() {
  const captainsQuery = useQuery({
    queryKey: queryKeys.availableCaptains,
    queryFn: orderApi.availableCaptains,
  });

  return (
    <DashboardShell title="Captains" navItems={[{ href: "/admin/dashboard", label: "Dashboard" }, { href: "/admin/captains", label: "Captains" }]}>
      <DataState
        isLoading={captainsQuery.isLoading}
        error={getErrorMessage(captainsQuery.error, "")}
        isEmpty={!captainsQuery.data?.length}
        emptyTitle="No available captains"
        emptyDescription="Captains appear here when they are online and available."
      >
        <DataTable
          columns={["Captain ID", "Name", "Mobile"]}
          rows={(captainsQuery.data || []).map((captain) => ({
            "Captain ID": captain.id,
            Name: captain.user.name,
            Mobile: captain.user.mobile,
          }))}
        />
      </DataState>
    </DashboardShell>
  );
}
