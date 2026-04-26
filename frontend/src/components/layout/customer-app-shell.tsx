"use client";

import type { ReactNode } from "react";
import { CustomerFooter } from "@/components/customer/customer-footer";
import { CustomerStorefrontHeader } from "@/components/customer/customer-storefront-header";
import { CustomerBottomNav } from "@/components/layout/customer-bottom-nav";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { useAddressesQuery } from "@/features/addresses/address.hooks";
import { useCartQuery } from "@/features/cart/cart.hooks";
import { getCartSummary } from "@/features/cart/cart.utils";
import { useUIStore } from "@/store/ui-store";

export const CustomerAppShell = ({ children }: { children: ReactNode }) => {
  const { selectedShopId, selectedAddressId, customerLocation } = useUIStore();
  const addressesQuery = useAddressesQuery();
  const cartQuery = useCartQuery(selectedShopId);
  const cartSummary = getCartSummary(cartQuery.data);

  const activeAddress =
    (addressesQuery.data || []).find((address) => address.id === selectedAddressId) ||
    (addressesQuery.data || []).find((address) => address.isDefault) ||
    addressesQuery.data?.[0];

  const locationLabel = activeAddress
    ? `${activeAddress.houseNo}, ${activeAddress.street}, ${activeAddress.village}`
    : customerLocation?.label || "Choose your delivery area";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white pb-24 md:pb-0">
        <CustomerStorefrontHeader
          locationLabel={locationLabel}
          cartCount={cartSummary.itemCount}
        />
        {children}
        <CustomerFooter />
      </div>
      <CustomerBottomNav />
    </ProtectedRoute>
  );
};
