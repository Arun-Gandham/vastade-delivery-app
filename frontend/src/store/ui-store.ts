import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  selectedShopId?: string;
  selectedAddressId?: string;
  customerLocation?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  hasRequestedCustomerLocation: boolean;
  mobileNavOpen: boolean;
  setSelectedShopId: (shopId?: string) => void;
  setSelectedAddressId: (addressId?: string) => void;
  setCustomerLocation: (location?: { latitude: number; longitude: number; label: string }) => void;
  setHasRequestedCustomerLocation: (value: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      mobileNavOpen: false,
      hasRequestedCustomerLocation: false,
      setSelectedShopId: (selectedShopId) => set({ selectedShopId }),
      setSelectedAddressId: (selectedAddressId) => set({ selectedAddressId }),
      setCustomerLocation: (customerLocation) => set({ customerLocation }),
      setHasRequestedCustomerLocation: (hasRequestedCustomerLocation) => set({ hasRequestedCustomerLocation }),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
    }),
    {
      name: "zepto-ui-store",
      partialize: (state) => ({
        selectedShopId: state.selectedShopId,
        selectedAddressId: state.selectedAddressId,
        customerLocation: state.customerLocation,
        hasRequestedCustomerLocation: state.hasRequestedCustomerLocation,
      }),
    }
  )
);
