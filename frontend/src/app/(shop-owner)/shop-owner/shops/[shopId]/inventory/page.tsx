"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { useInventoryMutations, useInventoryQuery } from "@/features/inventory/inventory.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function ShopInventoryPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const inventoryQuery = useInventoryQuery(shopId);
  const mutations = useInventoryMutations(shopId);

  return (
    <DashboardShell
      title="Inventory"
      navItems={[
        { href: "/shop-owner/shops", label: "Shops" },
        { href: `/shop-owner/shops/${shopId}/dashboard`, label: "Dashboard" },
        { href: `/shop-owner/shops/${shopId}/inventory`, label: "Inventory" },
        { href: `/shop-owner/shops/${shopId}/orders`, label: "Orders" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <DataState
          isLoading={inventoryQuery.isLoading}
          error={getErrorMessage(inventoryQuery.error, "")}
          isEmpty={!inventoryQuery.data?.length}
          emptyTitle="No inventory found"
          emptyDescription="Populate stock from admin product management and shop inventory setup."
        >
          <DataTable
            columns={["Product", "Available", "Reserved", "Sold", "Low Stock Alert", "Actions"]}
            rows={(inventoryQuery.data || []).map((item) => ({
              Product: item.product.name,
              Available: item.availableStock,
              Reserved: item.reservedStock,
              Sold: item.soldStock,
              "Low Stock Alert": item.lowStockAlert,
              Actions: (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      mutations.adjust.mutate({
                        productId: item.productId,
                        payload: {
                          quantity: 1,
                          adjustmentType: "ADD",
                          remarks: "Quick stock add",
                        },
                      })
                    }
                  >
                    +1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      mutations.update.mutate({
                        productId: item.productId,
                        payload: {
                          availableStock: item.availableStock,
                          lowStockAlert: item.lowStockAlert,
                          isAvailable: !item.isAvailable,
                        },
                      })
                    }
                  >
                    Toggle
                  </Button>
                </div>
              ),
            }))}
          />
        </DataState>
      </div>
    </DashboardShell>
  );
}
