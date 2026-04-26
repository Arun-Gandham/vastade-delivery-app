"use client";

import Link from "next/link";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { CartItemCard } from "@/components/customer/cart-item-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { useCartMutations, useCartQuery } from "@/features/cart/cart.hooks";
import { getCartSummary } from "@/features/cart/cart.utils";
import { getErrorMessage } from "@/lib/utils/errors";
import { useUIStore } from "@/store/ui-store";

export default function CustomerCartPage() {
  const { selectedShopId } = useUIStore();
  const cartQuery = useCartQuery(selectedShopId);
  const cartMutations = useCartMutations(selectedShopId);
  const summary = getCartSummary(cartQuery.data);

  return (
    <CustomerAppShell>
      <PageContainer title="Cart" description="Review items before checkout.">
        <DataState
          isLoading={cartQuery.isLoading}
          error={selectedShopId ? getErrorMessage(cartQuery.error, "") : null}
          isEmpty={!selectedShopId || !cartQuery.data?.items?.length}
          emptyTitle="Your cart is empty"
          emptyDescription="Select a shop and add products to continue."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cartQuery.data?.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onChangeQuantity={(quantity) => cartMutations.updateItem.mutate({ cartItemId: item.id, quantity })}
                />
              ))}
            </div>
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Items</span>
                <span className="font-semibold">{summary.itemCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
                <PriceText value={summary.subtotal} className="font-semibold" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => selectedShopId && cartMutations.clear.mutate(selectedShopId)}>
                  Clear cart
                </Button>
                <Link href="/customer/checkout" className="flex-1">
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>
            </Card>
          </div>
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
