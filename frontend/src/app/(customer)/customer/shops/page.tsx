"use client";

import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { ShopCard } from "@/components/customer/shop-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { useNearbyShopsQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CustomerShopsPage() {
  const shopsQuery = useNearbyShopsQuery();

  return (
    <CustomerAppShell>
      <PageContainer title="Nearby Shops" description="Browse stores that are currently configured in the backend.">
        <DataState
          isLoading={shopsQuery.isLoading}
          error={getErrorMessage(shopsQuery.error, "")}
          isEmpty={!shopsQuery.data?.length}
          emptyTitle="No shops found"
          emptyDescription="Ask an admin to create shops or update the nearby filters on the backend."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shopsQuery.data?.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
