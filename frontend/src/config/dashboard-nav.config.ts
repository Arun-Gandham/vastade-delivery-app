import type { Role } from "@/config/roles.config";

export type DashboardNavItem = {
  href: string;
  label: string;
};

const adminItems: DashboardNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/shops", label: "Shops" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/captains", label: "Captains" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/reports/sales", label: "Sales Report" },
  { href: "/admin/reports/product-sales", label: "Product Report" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/settings", label: "Settings" },
];

const superAdminItems: DashboardNavItem[] = [
  { href: "/super-admin/dashboard", label: "Dashboard" },
  { href: "/super-admin/admins", label: "Admins" },
  { href: "/super-admin/audit-logs", label: "Audit Logs" },
  { href: "/super-admin/settings", label: "Settings" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/shops", label: "Shops" },
  { href: "/admin/orders", label: "Orders" },
];

const shopOwnerRootItems: DashboardNavItem[] = [
  { href: "/shop-owner/shops", label: "Shops" },
  { href: "/shop-owner/profile", label: "Profile" },
  { href: "/shop-owner/notifications", label: "Notifications" },
];

const buildShopOwnerItems = (pathname: string) => {
  const match = pathname.match(/\/shop-owner\/shops\/([^/]+)/);
  const shopId = match?.[1];

  if (!shopId) {
    return shopOwnerRootItems;
  }

  return [
    { href: "/shop-owner/shops", label: "Shops" },
    { href: `/shop-owner/shops/${shopId}/dashboard`, label: "Dashboard" },
    { href: `/shop-owner/shops/${shopId}/inventory`, label: "Inventory" },
    { href: `/shop-owner/shops/${shopId}/products`, label: "Products" },
    { href: `/shop-owner/shops/${shopId}/orders`, label: "Orders" },
    { href: `/shop-owner/shops/${shopId}/reports`, label: "Reports" },
    { href: "/shop-owner/profile", label: "Profile" },
    { href: "/shop-owner/notifications", label: "Notifications" },
  ];
};

export const getDashboardNavItems = (role: Role | undefined, pathname: string): DashboardNavItem[] => {
  if (role === "SUPER_ADMIN" || pathname.startsWith("/super-admin")) {
    return superAdminItems;
  }

  if (role === "ADMIN" || pathname.startsWith("/admin")) {
    return adminItems;
  }

  if (role === "SHOP_OWNER" || role === "STORE_MANAGER" || pathname.startsWith("/shop-owner")) {
    return buildShopOwnerItems(pathname);
  }

  return [];
};
