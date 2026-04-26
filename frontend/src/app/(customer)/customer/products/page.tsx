"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { ProductCard } from "@/components/customer/product-card";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCartMutations } from "@/features/cart/cart.hooks";
import { useAddressesQuery } from "@/features/addresses/address.hooks";
import { useCategoriesQuery } from "@/features/categories/category.hooks";
import { useProductsQuery } from "@/features/products/product.hooks";
import { useNearbyShopsQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { useUIStore } from "@/store/ui-store";

function CustomerProductsPageContent() {
  const searchParams = useSearchParams();
  const { selectedShopId, selectedAddressId, customerLocation } = useUIStore();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const addressesQuery = useAddressesQuery();
  const defaultAddress = useMemo(
    () =>
      (addressesQuery.data || []).find((address) => address.id === selectedAddressId) ||
      (addressesQuery.data || []).find((address) => address.isDefault) ||
      addressesQuery.data?.[0],
    [addressesQuery.data, selectedAddressId]
  );
  const shopsQuery = useNearbyShopsQuery(
    defaultAddress
      ? {
          village: defaultAddress.village,
          pincode: defaultAddress.pincode,
        }
      : customerLocation
        ? undefined
        : undefined
  );
  const activeShopId = useMemo(() => {
    if (!selectedShopId) {
      return shopsQuery.data?.[0]?.id;
    }

    if (!shopsQuery.data?.length) {
      return selectedShopId;
    }

    return shopsQuery.data.some((shop) => shop.id === selectedShopId)
      ? selectedShopId
      : shopsQuery.data[0].id;
  }, [selectedShopId, shopsQuery.data]);
  const categoriesQuery = useCategoriesQuery();
  const productsQuery = useProductsQuery({ shopId: activeShopId, search, categoryId: categoryId || undefined });
  const cartMutations = useCartMutations(activeShopId);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setCategoryId(searchParams.get("categoryId") || "");
  }, [searchParams]);

  const categoryOptions = useMemo(
    () => [{ label: "All categories", value: "" }, ...(categoriesQuery.data || []).map((item) => ({ label: item.name, value: item.id }))],
    [categoriesQuery.data]
  );

  return (
    <CustomerAppShell>
      <PageContainer title="Products" description="Search inventory from the currently selected shop.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search milk, rice, fruit..." />
          <Select label="Category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} options={categoryOptions} />
        </div>
        <DataState
          isLoading={productsQuery.isLoading}
          error={getErrorMessage(productsQuery.error, "")}
          isEmpty={!productsQuery.data?.length}
          emptyTitle="No products found"
          emptyDescription="Pick a shop and adjust the filters to view products."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {productsQuery.data?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={
                  activeShopId
                    ? () => cartMutations.addItem.mutate({ productId: product.id, quantity: 1, shopId: activeShopId })
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

export default function CustomerProductsPage() {
  return (
    <Suspense
      fallback={
        <CustomerAppShell>
          <PageContainer title="Products" description="Loading products...">
            <div className="h-40 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white" />
          </PageContainer>
        </CustomerAppShell>
      }
    >
      <CustomerProductsPageContent />
    </Suspense>
  );
}
