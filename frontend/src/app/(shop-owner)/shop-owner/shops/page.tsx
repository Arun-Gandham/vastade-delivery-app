"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ShopCard } from "@/components/customer/shop-card";
import { DataState } from "@/components/shared/data-state";
import { useNearbyShopsQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

const navItems = [
  { href: "/shop-owner/shops", label: "Shops" },
  { href: "/shop-owner/profile", label: "Profile" },
  { href: "/shop-owner/notifications", label: "Notifications" },
];

export default function ShopOwnerShopsPage() {
  const shopsQuery = useNearbyShopsQuery();

  return (
    <DashboardShell title="Shop Owner" navItems={navItems}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Shops</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          The current backend does not expose an owned-shops list, so this page uses the live shop catalog. Opening a shop dashboard still respects backend role access.
        </p>
        <DataState
          isLoading={shopsQuery.isLoading}
          error={getErrorMessage(shopsQuery.error, "")}
          isEmpty={!shopsQuery.data?.length}
          emptyTitle="No shops found"
          emptyDescription="Create a shop from the admin panel first."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {shopsQuery.data?.map((shop) => (
              <div key={shop.id} className="space-y-3">
                <ShopCard shop={shop} />
                <div className="flex gap-3">
                  <Link href={`/shop-owner/shops/${shop.id}/dashboard`} className="text-sm font-medium text-[var(--color-primary)]">
                    Open dashboard
                  </Link>
                  <Link href={`/shop-owner/shops/${shop.id}/inventory`} className="text-sm font-medium text-[var(--color-primary)]">
                    Inventory
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </DataState>
      </div>
    </DashboardShell>
  );
}
