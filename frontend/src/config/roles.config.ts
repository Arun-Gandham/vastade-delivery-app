export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SHOP_OWNER: "SHOP_OWNER",
  STORE_MANAGER: "STORE_MANAGER",
  CUSTOMER: "CUSTOMER",
  CAPTAIN: "CAPTAIN",
} as const;

export type Role = (typeof roles)[keyof typeof roles];

export const roleHomePath: Record<Role, string> = {
  SUPER_ADMIN: "/super-admin/dashboard",
  ADMIN: "/admin/dashboard",
  SHOP_OWNER: "/shop-owner",
  STORE_MANAGER: "/shop-owner",
  CUSTOMER: "/customer",
  CAPTAIN: "/captain",
};
