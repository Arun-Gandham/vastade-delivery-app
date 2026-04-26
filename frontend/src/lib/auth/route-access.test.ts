import { canAccessPath, resolveHomePath } from "@/lib/auth/route-access";

describe("route access", () => {
  it("allows matching role access", () => {
    expect(canAccessPath("/customer/orders", "CUSTOMER")).toBe(true);
    expect(canAccessPath("/shop-owner/shops", "SHOP_OWNER")).toBe(true);
    expect(canAccessPath("/admin/dashboard", "SUPER_ADMIN")).toBe(true);
  });

  it("blocks mismatched roles", () => {
    expect(canAccessPath("/customer/orders", "CAPTAIN")).toBe(false);
    expect(canAccessPath("/captain/orders", "CUSTOMER")).toBe(false);
  });

  it("resolves dashboard paths by role", () => {
    expect(resolveHomePath("CUSTOMER")).toBe("/customer");
    expect(resolveHomePath("CAPTAIN")).toBe("/captain");
    expect(resolveHomePath("SUPER_ADMIN")).toBe("/super-admin/dashboard");
  });
});
