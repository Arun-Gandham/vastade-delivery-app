"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductCard } from "@/components/customer/product-card";
import { DataState } from "@/components/shared/data-state";
import { useProductsQuery } from "@/features/products/product.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function ShopProductsPage() {
  const params = useParams<{ shopId: string }>();
  const productsQuery = useProductsQuery({ shopId: params.shopId });

  return (
    <DashboardShell
      title="Shop Products"
      navItems={[
        { href: "/shop-owner/shops", label: "Shops" },
        { href: `/shop-owner/shops/${params.shopId}/dashboard`, label: "Dashboard" },
        { href: `/shop-owner/shops/${params.shopId}/products`, label: "Products" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <DataState
          isLoading={productsQuery.isLoading}
          error={getErrorMessage(productsQuery.error, "")}
          isEmpty={!productsQuery.data?.length}
          emptyTitle="No products found"
          emptyDescription="Products will appear once catalog items are assigned to this shop."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productsQuery.data?.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </DataState>
      </div>
    </DashboardShell>
  );
}
