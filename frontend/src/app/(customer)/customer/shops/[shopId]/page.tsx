"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { ProductCard } from "@/components/customer/product-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { useCartMutations } from "@/features/cart/cart.hooks";
import { useProductsQuery } from "@/features/products/product.hooks";
import { useShopQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { useUIStore } from "@/store/ui-store";

export default function CustomerShopDetailPage() {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;
  const { setSelectedShopId } = useUIStore();
  const shopQuery = useShopQuery(shopId);
  const productsQuery = useProductsQuery({ shopId, page: 1, limit: 20 });
  const cartMutations = useCartMutations(shopId);

  useEffect(() => {
    if (shopId) {
      setSelectedShopId(shopId);
    }
  }, [setSelectedShopId, shopId]);

  return (
    <CustomerAppShell>
      <PageContainer
        title={shopQuery.data?.name || "Shop"}
        description={shopQuery.data ? `${shopQuery.data.address}, ${shopQuery.data.village}` : "Loading shop details"}
      >
        <DataState
          isLoading={productsQuery.isLoading || shopQuery.isLoading}
          error={getErrorMessage(productsQuery.error || shopQuery.error, "")}
          isEmpty={!productsQuery.data?.length}
          emptyTitle="No products available"
          emptyDescription="This shop has no active inventory yet."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {productsQuery.data?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => cartMutations.addItem.mutate({ productId: product.id, quantity: 1, shopId })}
                isAdding={cartMutations.addItem.isPending}
              />
            ))}
          </div>
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
