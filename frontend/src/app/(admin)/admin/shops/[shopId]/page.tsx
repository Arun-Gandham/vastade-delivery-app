"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { Card } from "@/components/ui/card";
import { useShopQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminShopDetailPage() {
  const params = useParams<{ shopId: string }>();
  const shopQuery = useShopQuery(params.shopId);

  return (
    <DashboardShell title="Shop Detail" navItems={[{ href: "/admin/shops", label: "Shops" }]}>
      <DataState
        isLoading={shopQuery.isLoading}
        error={getErrorMessage(shopQuery.error, "")}
        isEmpty={!shopQuery.data}
        emptyTitle="Shop unavailable"
        emptyDescription="This shop could not be loaded."
      >
        {shopQuery.data ? (
          <Card className="space-y-3">
            <h1 className="text-2xl font-bold">{shopQuery.data.name}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{shopQuery.data.address}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Status: {shopQuery.data.isOpen ? "Open" : "Closed"}</p>
          </Card>
        ) : null}
      </DataState>
    </DashboardShell>
  );
}
