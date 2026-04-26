import { roleHomePath, type Role } from "@/config/roles.config";

export const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/support",
  "/terms",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/unauthorized",
  "/captain/login",
  "/shop-owner/login",
  "/admin/login",
] as const;

export const protectedRouteMatchers = {
  customer: ["/customer"],
  captain: ["/captain"],
  shopOwner: ["/shop-owner"],
  admin: ["/admin"],
  superAdmin: ["/super-admin"],
} as const;

export const routeRoles = {
  "/customer": ["CUSTOMER"],
  "/captain": ["CAPTAIN"],
  "/shop-owner": ["SHOP_OWNER", "STORE_MANAGER"],
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  "/super-admin": ["SUPER_ADMIN"],
} satisfies Record<string, Role[]>;

export const isPublicRoute = (pathname: string) =>
  publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export const getDefaultRouteForRole = (role?: Role | null) =>
  role ? roleHomePath[role] : "/login";
