"use client";

import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import type { CartItem } from "@/types/domain";

export const CartItemCard = ({
  item,
  onChangeQuantity,
}: {
  item: CartItem;
  onChangeQuantity: (quantity: number) => void;
}) => (
  <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="text-base font-semibold">{item.product.name}</h3>
      <p className="text-sm text-[var(--color-text-muted)]">{item.product.unit}</p>
      <PriceText value={item.totalPrice} className="mt-2 text-sm font-semibold" />
    </div>
    <QuantityStepper value={item.quantity} onChange={onChangeQuantity} />
  </Card>
);
