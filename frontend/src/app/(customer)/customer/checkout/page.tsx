"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PriceText } from "@/components/ui/price-text";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddressesQuery } from "@/features/addresses/address.hooks";
import { useCartQuery } from "@/features/cart/cart.hooks";
import { getCartSummary } from "@/features/cart/cart.utils";
import { couponApi } from "@/features/coupons/coupon.api";
import { usePlaceOrderMutation } from "@/features/orders/order.hooks";
import { getErrorMessage } from "@/lib/utils/errors";
import { useUIStore } from "@/store/ui-store";

export default function CustomerCheckoutPage() {
  const router = useRouter();
  const { selectedShopId, selectedAddressId, setSelectedAddressId } = useUIStore();
  const addressesQuery = useAddressesQuery();
  const cartQuery = useCartQuery(selectedShopId);
  const placeOrderMutation = usePlaceOrderMutation();
  const [couponCode, setCouponCode] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [customerNotes, setCustomerNotes] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const summary = getCartSummary(cartQuery.data);

  useEffect(() => {
    if (!selectedAddressId && addressesQuery.data?.length) {
      const defaultAddress = addressesQuery.data.find((address) => address.isDefault) || addressesQuery.data[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addressesQuery.data, selectedAddressId, setSelectedAddressId]);

  const totalAmount = useMemo(() => summary.subtotal + 35 + 5 - discount, [discount, summary.subtotal]);

  const applyCoupon = async () => {
    if (!selectedShopId || !couponCode) return;
    try {
      const result = await couponApi.validate({
        shopId: selectedShopId,
        couponCode,
        cartAmount: summary.subtotal,
      });
      setDiscount(result.discount);
      setCouponMessage(`Coupon applied. Discount: INR ${result.discount.toFixed(2)}`);
    } catch (error) {
      setDiscount(0);
      setCouponMessage(getErrorMessage(error, "Coupon invalid"));
    }
  };

  const placeOrder = async () => {
    if (!selectedShopId || !selectedAddressId) return;
    const order = await placeOrderMutation.mutateAsync({
      shopId: selectedShopId,
      addressId: selectedAddressId,
      paymentMode: paymentMode as "COD" | "UPI_MANUAL" | "RAZORPAY",
      couponCode: couponCode || null,
      customerNotes,
    });
    router.push(`/customer/orders/${order.id}`);
  };

  return (
    <CustomerAppShell>
      <PageContainer title="Checkout" description="Confirm address, review fees, and place your order.">
        <DataState
          isLoading={addressesQuery.isLoading || cartQuery.isLoading}
          error={selectedShopId ? getErrorMessage(addressesQuery.error || cartQuery.error, "") : null}
          isEmpty={!selectedShopId || !cartQuery.data?.items?.length}
          emptyTitle="Checkout unavailable"
          emptyDescription="Add items to your cart before placing an order."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <Card className="space-y-4">
                <h2 className="text-lg font-semibold">Delivery address</h2>
                <Select
                  label="Choose address"
                  value={selectedAddressId || ""}
                  onChange={(event) => setSelectedAddressId(event.target.value)}
                  options={(addressesQuery.data || []).map((address) => ({
                    label: `${address.fullName} - ${address.houseNo}, ${address.street}`,
                    value: address.id,
                  }))}
                />
              </Card>
              <Card className="space-y-4">
                <h2 className="text-lg font-semibold">Payment</h2>
                <Select
                  label="Payment mode"
                  value={paymentMode}
                  onChange={(event) => setPaymentMode(event.target.value)}
                  options={[
                    { label: "Cash on Delivery", value: "COD" },
                    { label: "Manual UPI", value: "UPI_MANUAL" },
                  ]}
                />
                <Input label="Coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
                <Button variant="outline" onClick={() => void applyCoupon()}>
                  Apply Coupon
                </Button>
                {couponMessage ? <p className="text-sm text-[var(--color-text-muted)]">{couponMessage}</p> : null}
                <Textarea label="Notes" value={customerNotes} onChange={(event) => setCustomerNotes(event.target.value)} />
              </Card>
            </div>
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
                <PriceText value={summary.subtotal} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Delivery fee</span>
                <PriceText value={35} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Platform fee</span>
                <PriceText value={5} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Discount</span>
                <PriceText value={discount} />
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="font-semibold">Total</span>
                <PriceText value={totalAmount} className="text-lg font-bold" />
              </div>
              <Button className="w-full" loading={placeOrderMutation.isPending} onClick={() => void placeOrder()}>
                Place Order
              </Button>
            </Card>
          </div>
        </DataState>
      </PageContainer>
    </CustomerAppShell>
  );
}
