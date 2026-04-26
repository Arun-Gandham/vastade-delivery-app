"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomerLocationBanner } from "@/components/customer/customer-location-banner";
import { OrderCard } from "@/components/customer/order-card";
import { ProductCard } from "@/components/customer/product-card";
import { ShopCard } from "@/components/customer/shop-card";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  buildAddressPayloadFromLocation,
  reverseGeocodeCoordinates
} from "@/features/addresses/address-location";
import { useAddressMutations, useAddressesQuery } from "@/features/addresses/address.hooks";
import { useCartMutations, useCartQuery } from "@/features/cart/cart.hooks";
import { getCartSummary } from "@/features/cart/cart.utils";
import { useCategoriesQuery } from "@/features/categories/category.hooks";
import { useOrdersQuery } from "@/features/orders/order.hooks";
import { useProductsQuery } from "@/features/products/product.hooks";
import { useNearbyShopsQuery } from "@/features/shops/shop.hooks";
import { useLocation } from "@/hooks/use-location";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatCurrency } from "@/lib/utils/format";
import { useAuth } from "@/providers/auth-provider";
import { useUIStore } from "@/store/ui-store";

const promoCards = [
  {
    title: "Daily essentials",
    description: "Milk, bread, fruits, vegetables, and home staples for the week.",
    tone: "from-[rgba(31,157,85,0.95)] to-[rgba(31,157,85,0.65)]"
  },
  {
    title: "Pharma and wellness",
    description: "Keep first-aid, wellness, and home care items within easy reach.",
    tone: "from-[rgba(37,99,235,0.16)] to-[rgba(37,99,235,0.04)]"
  },
  {
    title: "Baby and family care",
    description: "Fast restocks for care products, snacks, and home needs.",
    tone: "from-[rgba(240,140,0,0.18)] to-[rgba(240,140,0,0.05)]"
  }
];

const categoryTileAccents = [
  { label: "Fresh", gradient: "linear-gradient(135deg, rgba(31,157,85,0.18), rgba(31,157,85,0.04))" },
  { label: "Daily", gradient: "linear-gradient(135deg, rgba(240,140,0,0.18), rgba(240,140,0,0.04))" },
  { label: "Local", gradient: "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(37,99,235,0.04))" }
];

export default function CustomerHomePage() {
  const { user } = useAuth();
  const {
    selectedShopId,
    selectedAddressId,
    customerLocation,
    setSelectedShopId,
    setSelectedAddressId,
    setCustomerLocation
  } = useUIStore();
  const location = useLocation();
  const addressMutations = useAddressMutations();
  const [locationSyncError, setLocationSyncError] = useState<string | null>(null);
  const hasAttemptedAutoLocation = useRef(false);

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
          pincode: defaultAddress.pincode
        }
      : undefined
  );

  const activeShopId = useMemo(() => {
    if (!shopsQuery.data?.length) {
      return undefined;
    }

    return shopsQuery.data.some((shop) => shop.id === selectedShopId)
      ? selectedShopId
      : shopsQuery.data[0].id;
  }, [selectedShopId, shopsQuery.data]);

  const productsQuery = useProductsQuery({ page: 1, limit: 40, shopId: activeShopId });
  const categoriesQuery = useCategoriesQuery();
  const ordersQuery = useOrdersQuery();
  const cartQuery = useCartQuery(activeShopId);
  const cartMutations = useCartMutations(activeShopId);
  const cartSummary = getCartSummary(cartQuery.data);

  const syncCurrentLocation = useCallback(async () => {
    if (!user) {
      return;
    }

    setLocationSyncError(null);
    const coords = await location.requestLocation();
    const geocode = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
    const { label, payload } = buildAddressPayloadFromLocation({
      user,
      latitude: coords.latitude,
      longitude: coords.longitude,
      geocode,
      existingAddress: defaultAddress
    });

    const savedAddress = defaultAddress
      ? await addressMutations.update.mutateAsync({
          addressId: defaultAddress.id,
          payload
        })
      : await addressMutations.create.mutateAsync(payload);

    setSelectedAddressId(savedAddress.id);
    setCustomerLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      label
    });
  }, [
    addressMutations.create,
    addressMutations.update,
    defaultAddress,
    location,
    setCustomerLocation,
    setSelectedAddressId,
    user
  ]);

  useEffect(() => {
    if (defaultAddress && defaultAddress.id !== selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId, setSelectedAddressId]);

  useEffect(() => {
    if (activeShopId && activeShopId !== selectedShopId) {
      setSelectedShopId(activeShopId);
    }
  }, [activeShopId, selectedShopId, setSelectedShopId]);

  useEffect(() => {
    if (defaultAddress || customerLocation || hasAttemptedAutoLocation.current) {
      return;
    }

    hasAttemptedAutoLocation.current = true;
    void syncCurrentLocation().catch((error: unknown) => {
      setLocationSyncError(getErrorMessage(error, "We couldn't save your current location."));
    });
  }, [customerLocation, defaultAddress, syncCurrentLocation]);

  const featuredCategories = useMemo(
    () =>
      (categoriesQuery.data || [])
        .map((category) => ({
          category,
          products: (productsQuery.data || [])
            .filter((product) => product.categoryId === category.id)
            .slice(0, 8)
        }))
        .filter((entry) => entry.products.length > 0)
        .slice(0, 3),
    [categoriesQuery.data, productsQuery.data]
  );

  return (
    <CustomerAppShell>
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {!defaultAddress && !customerLocation ? (
          <CustomerLocationBanner
            loading={location.loading || addressMutations.create.isPending || addressMutations.update.isPending}
            error={locationSyncError || location.error}
            onUseLocation={() =>
              void syncCurrentLocation().catch((error: unknown) => {
                setLocationSyncError(getErrorMessage(error, "We couldn't save your current location."));
              })
            }
          />
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Card className="overflow-hidden border-none bg-[linear-gradient(120deg,#237A3B_0%,#2E8B57_45%,#C5DE5B_100%)] p-0 text-white">
            <div className="grid gap-4 p-8 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Quick delivery</p>
                <h1 className="max-w-xl text-4xl font-black leading-tight">
                  Stock up on fresh groceries and local essentials.
                </h1>
                <p className="max-w-lg text-sm text-white/90">
                  Browse nearby shops, find products from your selected area, and move straight to checkout
                  without hunting through admin-style screens.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={activeShopId ? `/customer/shops/${activeShopId}` : "/customer/shops"}>
                    <Button className="rounded-[16px] bg-white text-[var(--color-secondary)] hover:bg-white/90">
                      Shop Now
                    </Button>
                  </Link>
                  <Link href="/customer/addresses">
                    <Button
                      variant="ghost"
                      className="rounded-[16px] border border-white/25 bg-white/10 text-white hover:bg-white/15"
                    >
                      Manage Address
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 self-end sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/14 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/80">Selected shop</p>
                  <p className="mt-2 text-xl font-bold">
                    {shopsQuery.data?.find((shop) => shop.id === activeShopId)?.name || "Nearby store"}
                  </p>
                </div>
                <div className="rounded-[24px] bg-white/14 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/80">Cart value</p>
                  <p className="mt-2 text-xl font-bold">{formatCurrency(cartSummary.subtotal)}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4">
            {promoCards.map((card) => (
              <Card key={card.title} className={`bg-gradient-to-br ${card.tone} border-none`}>
                <h2 className="text-2xl font-bold text-[var(--color-secondary)]">{card.title}</h2>
                <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">{card.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Shop by category</h2>
            <Link href="/customer/products" className="text-sm font-semibold text-[var(--color-primary)]">
              See all
            </Link>
          </div>
          <DataState
            isLoading={categoriesQuery.isLoading}
            error={getErrorMessage(categoriesQuery.error, "")}
            isEmpty={!categoriesQuery.data?.length}
            emptyTitle="No categories yet"
            emptyDescription="Categories will appear once the backend catalog is configured."
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categoriesQuery.data?.slice(0, 12).map((category, index) => {
                const accent = categoryTileAccents[index % categoryTileAccents.length];

                return (
                  <Link
                    key={category.id}
                    href={`/customer/categories/${category.id}`}
                    className="group rounded-[26px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-1"
                  >
                    <div
                      className="mb-4 flex h-20 items-center justify-center rounded-[20px]"
                      style={{ background: accent.gradient }}
                    >
                      <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                        {accent.label}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm font-semibold text-[var(--color-secondary)]">{category.name}</p>
                  </Link>
                );
              })}
            </div>
          </DataState>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Nearby shops</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {defaultAddress
                  ? `Using ${defaultAddress.village}, ${defaultAddress.pincode}`
                  : "Using your available delivery context"}
              </p>
            </div>
            <Link href="/customer/shops" className="text-sm font-semibold text-[var(--color-primary)]">
              Browse all shops
            </Link>
          </div>
          <DataState
            isLoading={shopsQuery.isLoading}
            error={getErrorMessage(shopsQuery.error, "")}
            isEmpty={!shopsQuery.data?.length}
            emptyTitle="No nearby shops found"
            emptyDescription="Add a customer address or ask the admin to create shops in your area."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shopsQuery.data?.slice(0, 6).map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </DataState>
        </section>

        <section className="space-y-8">
          <DataState
            isLoading={productsQuery.isLoading}
            error={activeShopId ? getErrorMessage(productsQuery.error, "") : null}
            isEmpty={!featuredCategories.length}
            emptyTitle="No products available"
            emptyDescription="Choose a shop with active inventory to see product sections."
          >
            {featuredCategories.map(({ category, products }) => (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Picks from {shopsQuery.data?.find((shop) => shop.id === activeShopId)?.name || "your selected shop"}
                    </p>
                  </div>
                  <Link href={`/customer/categories/${category.id}`} className="text-sm font-semibold text-[var(--color-primary)]">
                    See all
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={
                        activeShopId
                          ? () =>
                              cartMutations.addItem.mutate({
                                productId: product.id,
                                quantity: 1,
                                shopId: activeShopId
                              })
                          : undefined
                      }
                      isAdding={cartMutations.addItem.isPending}
                    />
                  ))}
                </div>
              </div>
            ))}
          </DataState>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Your recent orders</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Quick access to reorder or track recent deliveries.
              </p>
            </div>
            <Link href="/customer/orders" className="text-sm font-semibold text-[var(--color-primary)]">
              Order history
            </Link>
          </div>
          <DataState
            isLoading={ordersQuery.isLoading}
            error={getErrorMessage(ordersQuery.error, "")}
            isEmpty={!ordersQuery.data?.length}
            emptyTitle="No orders yet"
            emptyDescription="Place your first order and it will appear here for quick tracking."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ordersQuery.data?.slice(0, 3).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </DataState>
        </section>
      </main>
    </CustomerAppShell>
  );
}
