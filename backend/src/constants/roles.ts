import { UserRole } from "@prisma/client";

export const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
export const SHOP_ROLES: UserRole[] = [UserRole.SHOP_OWNER, UserRole.STORE_MANAGER];
