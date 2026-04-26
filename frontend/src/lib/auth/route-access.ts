import type { Role } from "@/config/roles.config";
import { roleHomePath } from "@/config/roles.config";

export const getAllowedRolesForPath = (pathname: string): Role[] => {
  if (pathname.startsWith("/customer")) return ["CUSTOMER"];
  if (pathname.startsWith("/captain")) return ["CAPTAIN"];
  if (pathname.startsWith("/shop-owner")) return ["SHOP_OWNER", "STORE_MANAGER"];
  if (pathname.startsWith("/admin")) return ["ADMIN", "SUPER_ADMIN"];
  if (pathname.startsWith("/super-admin")) return ["SUPER_ADMIN"];
  return [];
};

export const canAccessPath = (pathname: string, role?: Role | null) => {
  const allowedRoles = getAllowedRolesForPath(pathname);
  if (allowedRoles.length === 0) return true;
  return role ? allowedRoles.includes(role) : false;
};

export const resolveHomePath = (role?: Role | null) => (role ? roleHomePath[role] : "/login");
