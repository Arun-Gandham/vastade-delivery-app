import { getCartSummary } from "@/features/cart/cart.utils";

describe("cart summary", () => {
  it("calculates subtotal and item count", () => {
    const summary = getCartSummary({
      id: "cart-1",
      customerId: "customer-1",
      shopId: "shop-1",
      items: [
        {
          id: "item-1",
          productId: "product-1",
          quantity: 2,
          unitPrice: 30,
          totalPrice: 60,
          product: {
            id: "product-1",
            categoryId: "cat-1",
            name: "Milk",
            unit: "500 ml",
            mrp: 35,
            sellingPrice: 30,
          },
        },
        {
          id: "item-2",
          productId: "product-2",
          quantity: 1,
          unitPrice: 40,
          totalPrice: 40,
          product: {
            id: "product-2",
            categoryId: "cat-1",
            name: "Bread",
            unit: "1 pack",
            mrp: 45,
            sellingPrice: 40,
          },
        },
      ],
    });

    expect(summary.itemCount).toBe(3);
    expect(summary.subtotal).toBe(100);
  });
});
