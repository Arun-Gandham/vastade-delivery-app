"use client";

import { useParams } from "next/navigation";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { ProductCard } from "@/components/customer/product-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { useCartMutations } from "@/features/cart/cart.hooks";
import { useProductsQuery } from "@/features/products/product.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { useUIStore } from "@/store/ui-store";

export default function CustomerCategoryDetailPage() {
  const params = useParams<{ categoryId: string }>();
  const { selectedShopId } = useUIStore();
  const productsQuery = useProductsQuery({ categoryId: params.categoryId, shopId: selectedShopId });
  const cartMutations = useCartMutations(selectedShopId);

  return (
    <CustomerAppShell>
      <PageContainer title="Category Products" description="Products filtered by the selected category.">
        <DataState
          isLoading={productsQuery.isLoading}
          error={getErrorMessage(productsQuery.error, "")}
          isEmpty={!productsQuery.data?.length}
          emptyTitle="No products in this category"
          emptyDescription="Adjust your selected shop or wait for inventory to be updated."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {productsQuery.data?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={
                  selectedShopId
                    ? () => cartMutations.addItem.mutate({ productId: product.id, quantity: 1, shopId: selectedShopId })
                    : undefined
                }
                isAdding={cartMutations.addItem.isPending}
              />
            ))}
          </div>
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
