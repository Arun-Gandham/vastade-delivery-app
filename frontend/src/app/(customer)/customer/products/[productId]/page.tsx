"use client";

import { useParams } from "next/navigation";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { useCartMutations } from "@/features/cart/cart.hooks";
import { useProductQuery } from "@/features/products/product.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { useUIStore } from "@/store/ui-store";

export default function CustomerProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const { selectedShopId } = useUIStore();
  const productQuery = useProductQuery(params.productId, selectedShopId);
  const cartMutations = useCartMutations(selectedShopId);

  return (
    <CustomerAppShell>
      <PageContainer title={productQuery.data?.name || "Product"} description={productQuery.data?.brand || "Product details"}>
        <DataState
          isLoading={productQuery.isLoading}
          error={getErrorMessage(productQuery.error, "")}
          isEmpty={!productQuery.data}
          emptyTitle="Product unavailable"
          emptyDescription="This product could not be loaded for the selected shop."
        >
          {productQuery.data ? (
            <Card className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-muted)]">{productQuery.data.unit}</p>
                <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                  {productQuery.data.description || "No detailed description was provided by the backend for this product."}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <PriceText value={productQuery.data.sellingPrice} className="text-2xl font-bold" />
                  <p className="text-sm text-[var(--color-text-muted)] line-through">
                    <PriceText value={productQuery.data.mrp} />
                  </p>
                </div>
                <Button
                  disabled={!selectedShopId}
                  loading={cartMutations.addItem.isPending}
                  onClick={() =>
                    selectedShopId
                      ? cartMutations.addItem.mutate({
                          productId: productQuery.data!.id,
                          quantity: 1,
                          shopId: selectedShopId,
                        })
                      : undefined
                  }
                >
                  {selectedShopId ? "Add to cart" : "Select a shop first"}
                </Button>
              </div>
            </Card>
          ) : null}
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
