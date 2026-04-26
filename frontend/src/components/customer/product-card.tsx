"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import type { Product } from "@/types/domain";

export const ProductCard = ({
  product,
  onAdd,
  isAdding,
}: {
  product: Product;
  onAdd?: () => void;
  isAdding?: boolean;
}) => (
  <Card className="flex h-full flex-col gap-3">
    <div className="flex-1">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
        {product.brand || "Daily essentials"}
      </p>
      <Link href={`/customer/products/${product.id}`} className="mt-1 block text-lg font-semibold">
        {product.name}
      </Link>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{product.unit}</p>
    </div>
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <PriceText value={product.sellingPrice} className="text-base font-semibold" />
        <span className="text-xs text-[var(--color-text-muted)] line-through">
          <PriceText value={product.mrp} />
        </span>
      </div>
      {onAdd ? (
        <Button onClick={onAdd} loading={isAdding} disabled={product.isAvailable === false}>
          {product.isAvailable === false ? "Out of stock" : "Add"}
        </Button>
      ) : null}
    </div>
  </Card>
);
